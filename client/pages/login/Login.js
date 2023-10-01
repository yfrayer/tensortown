import { ScrollView, Pressable, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';
import { Restart } from 'fiction-expo-restart';
import styles from 'themes/form';
import pageStyle from 'themes/page';

export default function Login(props) {
  const url = Constants.expoConfig.extra.baseUrl;
  const navigate = useNavigate();
  const loggedIn = useSelector(state => state.user.loggedIn);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const logout = () => {
    navigate('/logout');
  };
  const goToResetPass = () => {
    navigate('/resetPass');
  };
  const goToSignup = () => {
    navigate('/signup');
  };
  const submit =  async() => {
    if (email) { setEmailError(false); } else { setEmailError(true); return; }
    if (pass) { setPassError(false); } else { setPassError(true); return; }
    let data = {};
    data.email = email;
    data.password = pass;
    fetch(url + '/api/login', {
      headers: {'Content-Type':'application/json'},
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then((result) => {
      if (result.success) {
        setLoginError(false);
      } else {
        setLoginError(true);
        return;
      }
      navigate('/');
      Restart();
    }, (err) => {
      setLoginError(true);
    });
  }
  if (loggedIn) {
    return (
      <Pressable onPress={logout}>
        <Text style={modalStyle.small}>
          You are already logged in. Click here to log out.
        </Text>
      </Pressable>
    );
  } else {
    return (
      <ScrollView>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.field}
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={submit}
          placeholder="Enter your email"
        />
        { emailError &&
          <Text style={styles.error}>Enter your email</Text>
        }
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.field}
          value={pass}
          onChangeText={setPass}
          onSubmitEditing={submit}
          placeholder="Enter your password"
          secureTextEntry={true}
        />
        { passError &&
          <Text style={styles.error}>Enter your password</Text>
        }
        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
        { loginError &&
          <Text style={styles.error}>Login unsuccessful</Text>
        }
        <Text style={styles.link} onPress={goToSignup}>
          Create a new account
        </Text>
        <Text style={styles.link} onPress={goToResetPass}>
          Forgot password?
        </Text>
      </ScrollView>
    );
  }
}
