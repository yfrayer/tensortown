import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { BrowserRouter } from 'react-router-dom';
import { NativeRouter } from 'react-router-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, addUser, initialUsers } from 'utils/actions';
import { removeUser } from 'utils/actions';
import Router from 'pages/Router';
import socket from 'utils/socket';

export default function Initialize() {
  const dispatch = useDispatch();
  const dispatchUser = (user) => {
    dispatch(updateUser(user));
  };
  const dispatchAddUser = (user) => {
    dispatch(addUser(user));
  };
  const dispatchRemoveUser = (user) => {
    dispatch(removeUser(user));
  };
  const dispatchInitialUsers = (users) => {
    dispatch(initialUsers(users));
  };
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log('connected');
      socket.emit('getUser');
      socket.emit('getPlayers');
    }
    const onDisconnect = () => {
      setIsConnected(false);
      console.log('disconnected');
    }
    const onConnectError = () => {
      console.log('error');
    }
    const onSetUser = (data) => {
      dispatchUser(data);
    }
    const onUserEnter = (data) => {
      dispatchAddUser(data);
    };
    const onUserLeave = (data) => {
      dispatchRemoveUser(data);
    };
    const onSetPlayers = (data) => {
      dispatchInitialUsers(data);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('setUser', onSetUser);
    socket.on('userEnter', onUserEnter);
    socket.on('userLeave', onUserLeave);
    socket.on('setPlayers', onSetPlayers);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('setUser', onSetUser);
      socket.off('userEnter', onUserEnter);
      socket.off('userLeave', onUserLeave);
      socket.off('setPlayers', onSetPlayers);
    };
  }, []);
  if (Platform.OS === 'web') {
    return (
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    );
  } else {
    return (
      <NativeRouter>
        <Router/>
      </NativeRouter>
    );
  }
}
