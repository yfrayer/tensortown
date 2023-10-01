import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Constants from 'expo-constants';
import styles from 'themes/form';
import modalStyle from 'themes/modal';

export default function TokenResetPass(props) {
  const url = Constants.expoConfig.extra.baseUrl;
  const navigate = useNavigate();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [success, setSuccess] = useState(false);
  const goToLogin = () => {
    navigate('/login');
  };
  const submit = async() => {
    if (pass == '' || confirmPass == '') {
      setError(true);
      setErrorText('Fill out both fields');
      return;
    }
    if (pass !== confirmPass) {
      setError(true);
      setErrorText('Passwords do not match');
      return;
    }
    setError(false);
    let data = {};
    data.token = props.token;
    data.password = pass;
    fetch(url + '/api/login/resetPassToken', {
      headers: {'Content-Type':'application/json'},
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then((result) => {
      if (result.result == 'success') {
        setSuccess(true);
      }
      else {
        setError(true);
        setErrorText('Error');
      }
    }, (err) => {
      setError(true);
      setErrorText('Error');
    });
  }
  if (success) {
    return (
      <Text onPress={goToLogin} style={modalStyle.small}>
        Successfully changed password. Click to return to login.
      </Text>
    );
  } else {
    return (
      <ScrollView style={modalStyle.smallForm}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.field}
          value={pass}
          onChangeText={setPass}
          onSubmitEditing={submit}
          secureTextEntry={true}
          placeholder="Enter your new password"
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.field}
          value={confirmPass}
          onChangeText={setConfirmPass}
          onSubmitEditing={submit}
          secureTextEntry={true}
          placeholder="Confirm your password"
        />
        { error &&
          <Text style={styles.error}>{errorText}</Text>
        }
        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    );
  }
}
