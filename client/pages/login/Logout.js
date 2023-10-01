import { Text } from 'react-native';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Restart } from 'fiction-expo-restart';
import Constants from 'expo-constants';
import socket from 'utils/socket';

export default function Logout() {
  const url = Constants.expoConfig.extra.baseUrl;
  const navigate = useNavigate();
  useEffect(() => {
    fetch(url + '/api/login/logout')
    .then(res => res.json())
    .then((result) => {
      if (result.logout == 'success') {
        navigate('/');
        Restart();
      }
    });
  });
  return (
    <></>
  );
}
