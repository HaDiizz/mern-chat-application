import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OFFLINE, ONLINE, UPDATE_USER_ACTIVE_DATE, CALL, ALERT } from './redux/types';

const SocketClient = () => {
  const { auth, online, socket, peer, call } = useSelector((state) => state);
  const dispatch = useDispatch();

  // joinServer
  useEffect(() => {
    if (socket) {
      socket.emit('joinUser', auth.user, peer);
    }
  }, [socket, auth, peer]);

  useEffect(() => {
    if (socket) {
      socket.on('checkUserOnline', (data) => {
        const filteredData = data.filter((item) => auth?.user?._id !== item.id);
        filteredData.forEach((item) => {
          if (
            !online.includes(item.id) &&
            !online.some((onlineItem) => onlineItem.id === item.id)
          ) {
            dispatch({
              type: ONLINE,
              payload: {
                id: item.id,
                username: item.username,
                avatar: item.avatar,
                peerId: item.peerId,
                activeDate: item.activeDate,
              },
            });
          } else {
            dispatch({
              type: UPDATE_USER_ACTIVE_DATE,
              payload: item.activeDate,
              
            });
          }
        });
      });
      return () => socket.off('checkUserOnline');
    }
  }, [socket, dispatch, online, auth?.user?._id]);

  useEffect(() => {
    if (socket) {
      socket.on('CheckUserOffline', (id) => {
        dispatch({ type: OFFLINE, payload: id });
        dispatch({ type: CALL, payload: null });
      });
      return () => socket.off('CheckUserOffline');
    }
  }, [socket, dispatch]);

    // Call User
    useEffect(() => {
     if(socket) {
      socket.on("callUserToClient", (data) => {
        dispatch({ type: CALL, payload: data });
      });
      return () => socket.off("callUserToClient");
     }
    }, [socket, dispatch]);

    
  useEffect(() => {
    if(socket) {
      socket.on("userBusy", (data) => {
        dispatch({
          type: ALERT,
          payload: { error: `${call?.username} is busy` },
        });
        dispatch({
          type: CALL,
          payload: null,
        });
      });
      return () => socket.off("userBusy");
    }
  }, [socket, dispatch, call]);
  

  return <div></div>;
};
export default SocketClient;