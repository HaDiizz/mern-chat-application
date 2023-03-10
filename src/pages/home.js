import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Peer from 'peerjs';
import { AiFillCopy } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { TfiReload } from 'react-icons/tfi';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';

const peer = new Peer(undefined, {
  path: '/',
  secure: false,
});
let conn;

const Home = () => {
  const { auth, online, socket, call } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [id, setId] = useState(0);
  const [dest, setDest] = useState('Destination PEER ID');
  const [connect, setConnect] = useState(false);
  const [sendMessage, setSendMessage] = useState('Write Something');
  const [receiveMessage, setReceiveMessage] = useState('...');
  const youVideo = useRef();
  const otherVideo = useRef();
  const [tracks, setTracks] = useState(null);
  const [newCall, setNewCall] = useState(null);

  useEffect(() => {
    peer.on('open', function (id) {
      dispatch({ type: 'PEER', payload: { id } });
      setId(id);
    });

    peer?.on('connection', function (newConn) {
      setConnect(true);
      conn = newConn;
      setDest(newConn.peer);
      newConn.on('open', function () {
        newConn.send('Hello!');
      });
      newConn.on('data', function (data) {
        setReceiveMessage(data);
      });
    });
  });

  const caller = ({ video }) => {
    if (dest) {
      let targetUser = online.filter((user) => user.peerId === dest);
      const { id, avatar, username } = targetUser[0];
      const msg = {
        sender: auth.user._id,
        recipient: id,
        avatar,
        username,
        video,
      };
      dispatch({ type: 'CALL', payload: msg });
    }
  };

  const callUser = ({ video }) => {
    const { _id, avatar, username } = auth.user;
    let targetUser = online.filter((user) => user.peerId === dest);
    const msg = {
      sender: _id,
      recipient: targetUser[0].id,
      avatar,
      username,
      video,
    };
    if (peer.open) msg.peerId = peer.id;
    socket.emit('callUser', msg);
  };

  const handleEndCall = async () => {
    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    if (newCall) newCall.close();
    socket.emit('endCall', { ...call });
    if (peer) await peer.destroy();
    await window.location.reload();
    dispatch({ type: 'CALL', payload: null });
    setConnect(false);
  };

  const checkBusy = () => {
    if (call) {
      setConnect(false);
      return;
    }
  };

  const openStream = (video) => {
    const config = { audio: true, video };
    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    video.play();
  };

  const handleAnswer = () => {
    openStream(true).then((stream) => {
      playStream(youVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);
      var newCall = peer.call(dest, stream);
      newCall.on('stream', function (remoteStream) {
        playStream(otherVideo.current, remoteStream);
      });
      setNewCall(newCall);
    });
  };

  async function startConnection() {
    await caller({ video: true });
    await callUser({ video: true });
    await checkBusy();
    conn = peer.connect(dest);
    await handleAnswer();
    conn.on('open', function () {
      setConnect(true);
      conn.on('data', function (data) {
        setReceiveMessage(data);
      });
    });
  }

  useEffect(() => {
    peer.on('call', (newCall) => {
      openStream(call.video).then((stream) => {
        if (youVideo.current) {
          playStream(youVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);
        newCall.answer(stream);
        newCall.on('stream', function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });
        setNewCall(newCall);
      });
    });

    return () => peer.removeListener('call');
  }, [peer, call?.video]);

  useEffect(() => {
    if (socket) {
      socket.on('endCallToClient', async (data) => {
        if (tracks) {
          tracks.forEach((track) => track.stop());
        }
        if (newCall) newCall.close();
        // if (peer) await peer.destroy();
        // await window.location.reload()
        setConnect(false);
        dispatch({ type: 'CALL', payload: null });
      });
      return () => socket.off('endCallToClient');
    }
  }, [socket, dispatch, newCall, tracks]);

  useEffect(() => {
    if (socket) {
      socket.on('callerDisconnect', () => {
        if (tracks) {
          tracks.forEach((track) => track.stop());
        }
        if (newCall) newCall.close();
        dispatch({ type: 'CALL', payload: null });
        dispatch({
          type: 'ALERT',
          payload: { error: `${call?.username} disconnected` },
        });
      });
      return () => socket.off('callerDisconnect');
    }
  }, [socket, call, dispatch, newCall, tracks]);

  function send() {
    conn.send(sendMessage);
  }

  useEffect(() => {
    if (connect && !call) {
      handleEndCall();
    }
  }, [connect, call]);

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('Copied to clipboard.');
  };

  useEffect(() => {
    if (!auth.token) navigate('/login');
  }, [auth.token, navigate]);

  return (
    <div className='container'>
      <Toaster />
      <div className='pt-[5rem] text-center h-screen justify-center items-center'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-7' style={{ zIndex: '1' }}>
            {connect && (
              <>
                <div className='call_modal'>
                  <div className='you_video_container'>
                    <video
                      ref={youVideo}
                      className='you_video border-2 border-neutral-300'
                      playsInline
                      muted
                      autoPlay
                    />
                  </div>
                  <video
                    ref={otherVideo}
                    className='other_video border-2 border-neutral-300'
                    playsInline
                    autoPlay
                  />
                </div>
              </>
            )}
            <span className='flex text-center justify-center gap-5'>
              <h4> Peer ID: {id}</h4>{' '}
              <TfiReload
                className='hover:cursor-pointer'
                onClick={() => navigate(0)}
              />
            </span>
            {connect ? (
              <h6 style={{ color: 'green' }}>Connected</h6>
            ) : (
              <h6 style={{ color: 'red' }}>Not Connected</h6>
            )}
            <input
              type='text'
              placeholder={dest}
              name='dest'
              className='form-control'
              onChange={(e) => setDest(e.target.value)}
            />
            {connect ? (
              <button className='btn btn-danger' onClick={handleEndCall}>
                Disconnect
              </button>
            ) : (
              <button
                type='submit'
                className='btn btn-success bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold'
                onClick={startConnection}
              >
                Connect
              </button>
            )}

            <br />
            <input
              type='text'
              placeholder={sendMessage}
              className='form-control'
              name='sendMessage'
              onChange={(e) => setSendMessage(e.target.value)}
            />
            <button
              type='submit'
              className='btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold'
              onClick={send}
            >
              Send Message
            </button>
            {connect && (
              <div className='text-left'>
                <h5>
                  Received Message From:{' '}
                  <span className='text-violet-500 uppercase font-bold'>
                    {call?.username}
                  </span>
                </h5>
              </div>
            )}
            <h5>
              Receive Message:{' '}
              <span className='text-indigo-600 '>{receiveMessage}</span>
            </h5>
          </div>
          <div className='pl-5 pr-5 b-3 flex flex-col text-left gap-y-5 mb-5'>
            {auth.user && auth.user.role === 'admin' ? (
              <Link
                to='/users'
                className='text-indigo-500'
                style={{ zIndex: '1' }}
              >
                See Users
              </Link>
            ) : null}
            <h1
              className='uppercase pt-5 text-black-500 font-bold dark:text-white'
              style={{ zIndex: '1' }}
            >
              Users Online
            </h1>
            {online?.map((item, index) => (
              <div
                key={index}
                className='card p-3 flex flex-row dark:text-black shadow-md'
              >
                <img
                  className='medium-avatar'
                  src={item?.avatar}
                  alt='avatar'
                />
                <div>
                  <p className='pl-5 text-indigo-700 uppercase'>
                    {item.username}
                  </p>
                  <p className='pl-5'>
                    Latest Active:{' '}
                    <span className='text-green-500'>
                      {moment(item.activeDate).fromNow()}
                    </span>
                  </p>
                  <p className='pl-5 flex'>
                    {item.peerId}{' '}
                    <span
                      className='pl-5 hover:cursor-pointer'
                      onClick={() => handleCopyLink(item.peerId)}
                    >
                      <AiFillCopy size={20} />
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
