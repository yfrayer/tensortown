import { ScrollView, Pressable, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Constants from 'expo-constants';
import styles from 'themes/form';
import modalStyle from 'themes/modal';

export default function ResetPass(props) {
  const url = Constants.expoConfig.extra.baseUrl;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const goBack = () => {
    navigate(-1);
  };
  const submit =  async() => {
    if (email) {
      setEmailError(false);
    } else {
      setEmailMessage('Enter your email');
      setEmailError(true);
      return;
    }
    fetch(url + '/api/login/resetPass', {
      headers: {'Content-Type':'application/json'},
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({email: email}),
    })
    .then(res => res.json())
    .then((result) => {
      if (result.result == 'no email') {
        setEmailMessage('Email not found');
        setEmailError(true);
        setEmailSent(false);
        return;
      } else if (result.result == 'mail sent') {
        setEmailError(false);
        setEmailSent(true);
      } else {
        setEmailMessage('Error sending mail');
        setEmailError(true);
        setEmailSent(false);
      }
    }, (err) => {
      setEmailMessage('Error');
      setEmailError(true);
    });
  }
  return (
    <ScrollView style={modalStyle.smallForm}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.field}
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={submit}
        placeholder="Enter your email"
      />
      { emailError &&
        <Text style={styles.error}>{emailMessage}</Text>
      }
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
      { emailSent &&
        <Text style={styles.text}>Email sent</Text>
      }
      <Text style={styles.link} onPress={goBack}>Go back</Text>
    </ScrollView>
  );
}
