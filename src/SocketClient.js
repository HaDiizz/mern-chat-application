import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OFFLINE, ONLINE, UPDATE_USER_ACTIVE_DATE } from './redux/types';

const SocketClient = () => {
  const { auth, online, socket, peer } = useSelector((state) => state);
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
      });
      return () => socket.off('CheckUserOffline');
    }
  }, [socket, dispatch]);

  return <div></div>;
};
export default SocketClient;
