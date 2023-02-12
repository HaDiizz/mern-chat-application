import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OFFLINE, ONLINE, SOCKET } from './redux/types';

const SocketClient = () => {
  const { auth, online, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  // joinServer
  useEffect(() => {
    socket.emit('joinUser', auth.user);
  }, [socket, auth.user]);

  // Check User online/offline
  useEffect(() => {
    socket.emit('checkUserOnline', auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    socket.on('checkUserOnlineToMe', (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({ type: ONLINE, payload: item.id });
        }
      });
    });
    return () => socket.off('checkUserOnlineToMe');
  }, [socket, dispatch, online]);

  // // Check User Offline
  // useEffect(() => {
  //   socket.on("CheckUserOffline", (id) => {
  //     dispatch({ type: OFFLINE, payload: id });
  //   });
  //   return () => socket.off("CheckUserOffline");
  // }, [socket, dispatch]);
  return <></>;
};

export default SocketClient;
