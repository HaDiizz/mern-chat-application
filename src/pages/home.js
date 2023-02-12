import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Peer from 'peerjs';
import { AiFillCopy } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import { TfiReload } from 'react-icons/tfi'
import moment from 'moment'

const peer = new Peer(undefined, {
  path: '/',
  secure: false,
});
let conn = peer.connect();

const Home = () => {
  const { auth, online } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [id, setId] = useState(0);
  const [dest, setDest] = useState('Destination PEER ID');
  const [connect, setConnect] = useState(false);
  const [sendMessage, setSendMessage] = useState('Write Something');
  const [receiveMessage, setReceiveMessage] = useState('...');

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

  function startConnection() {
    conn = peer.connect(dest);

    conn.on('open', function () {
      setConnect(true);
      conn.on('data', function (data) {
        setReceiveMessage(data);
      });
    });
  }

  function send() {
    conn.send(sendMessage);
  }

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(id);
  };

  useEffect(() => {
    if (!auth.token) navigate("/login");
  }, [auth.token, navigate]);

  return (
    <div className='container'>
      <div className='pt-[5rem] text-center h-screen justify-center items-center'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-7'>
            <span className='flex text-center justify-center gap-5'><h4> Peer ID: {id}</h4> <TfiReload className='hover:cursor-pointer' onClick={() => navigate(0)} /></span>
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
            <button
              type='submit'
              className='btn btn-success bg-green-600'
              onClick={startConnection}
            >
              Connect
            </button>
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
              className='btn btn-primary bg-indigo-700'
              onClick={send}
            >
              Send Message
            </button>
            <h5>Receive Message: <span className='text-indigo-600'>{receiveMessage}</span></h5>
          </div>
          <div className='pl-5 flex flex-col text-left pb-5'>
            {
              auth.user && auth.user.role === 'admin' ?
              <Link to='/users' className='text-indigo-500'>See Users</Link>
              : 
              null
            }
            <h1 className='uppercase pb-4 pt-5 text-green-500'>Users Online</h1>
            {
              online?.map((item, index) => (
                <div key={index} className='card p-3 flex flex-row'>
                  <img className='medium-avatar' src={item?.avatar} alt="avatar" />
                  <div>
                  <p className='pl-5'>{item.username}</p>
                  <p className='pl-5'>Latest Active: <span className='text-green-500'>{moment(item.activeDate).fromNow()}</span></p>
                  <p className='pl-5 flex'>{item.peerId} <span className='pl-5 hover:cursor-pointer' onClick={() => handleCopyLink(item.peerId)}><AiFillCopy size={20}/></span></p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
