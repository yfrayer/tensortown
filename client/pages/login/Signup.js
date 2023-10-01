import { ScrollView, Pressable, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Constants from 'expo-constants';
import { Restart } from 'fiction-expo-restart';
import styles from 'themes/form';

export default function Signup() {
  const url = Constants.expoConfig.extra.baseUrl;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const submit =  async() => {
    if (username == '' || email == '' || pass == '' || confirmPass == '') {
      setErrorText('Fill out all fields');
      setError(true);
      return;
    }
    if (pass.length < 6) {
      setErrorText('Password must be longer than 5 characters');
      setError(true);
      return;
    }
    if (pass !== confirmPass) {
      setErrorText('Passwords do not match');
      setError(true);
      return;
    }
    setError(false);
    let data = {};
    data.username = username;
    data.email = email;
    data.password = pass;
    fetch(url + '/api/login/signup', {
      headers: {'Content-Type':'application/json'},
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then((result) => {
      if (result.success) {
        navigate('/');
        Restart();
      } else {
        if (result.result == 'email already exists') {
          setErrorText('This email has already been used');
        } else {
          setErrorText('Error');
        }
        setError(true);
      }
    }, (err) => {
      setError(true);
      setErrorText('Error');
    });
  }
  return (
    <ScrollView>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.field}
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={submit}
        placeholder="Enter your username"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.field}
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={submit}
        placeholder="Enter your email"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.field}
        value={pass}
        onChangeText={setPass}
        onSubmitEditing={submit}
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.field}
        value={confirmPass}
        onChangeText={setConfirmPass}
        onSubmitEditing={submit}
        placeholder="Confirm your password"
        secureTextEntry={true}
      />
      { error &&
        <Text style={styles.error}>{errorText}</Text>
      }
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </ScrollView>
  );
}
