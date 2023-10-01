import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Constants from 'expo-constants';
import styles from 'themes/form';
import modalStyle from 'themes/modal';

export default function TokenVerifyEmail(props) {
  const url = Constants.expoConfig.extra.baseUrl;
  const navigate = useNavigate();
  const [message, setMessage] = useState('Loading...');
  const goToIndex = () => {
    navigate('/');
  };
  useEffect(() => {
    let data = {};
    data.token = props.token;
    fetch(url + '/api/login/verifyEmail', {
      headers: {'Content-Type':'application/json'},
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        setMessage('Email is verified. Click to dismiss.');
      }
      else {
        setMessage('Token is expired or invalid.');
      }
    }, (err) => {
      setMessage('Error');
    });
  }, []);
  return (
    <Text onPress={goToIndex} style={modalStyle.small}>{message}</Text>
  );
}
