import { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import PopIn from 'components/PopIn';
import Home from 'pages/Home';

import Login from 'pages/login/Login';
import Logout from 'pages/login/Logout';
import Signup from 'pages/login/Signup';
import ResetPass from 'pages/login/ResetPass';
import TokenResetPass from 'pages/login/TokenResetPass';
import TokenVerifyEmail from 'pages/login/TokenVerifyEmail';

import Explore from 'pages/explore/Explore';

import socket from 'utils/socket';
import styles from 'themes/app';
import colors from 'themes/colors';

export default function Router() {
  const location = useLocation();
  const theme = useSelector(state => state.theme.mode);
  const [animate, setAnimate] = useState(false);
  const [show, setShow] = useState(false);
  const [prevPath, setPrevPath] = useState(null);
  const validPages = ['/login', '/logout', '/signup', '/resetPass',
    '/token/resetPass', '/token/verifyEmail', '/explore'];
  const switchPage = () => {
    switch(location.pathname) {
      //login
      case '/login': return <Login/>;
      case '/logout': return <Logout/>;
      case '/signup': return <Signup/>;
      case '/resetPass': return <ResetPass/>;
      case '/token/resetPass': {
        const params = new URLSearchParams(location.search);
        return <TokenResetPass token={params.get('token')}/>;
      }
      case '/token/verifyEmail': {
        const params = new URLSearchParams(location.search);
        return <TokenVerifyEmail token={params.get('token')}/>;
      }
      //explore
      case '/explore': return <Explore/>;
      //blank to show the background (home)
      default: return <></>;
    }
  }
  useEffect(() => {
    //set page transition and visibility based on navigation
    const newPath = location.pathname;
    let prevValid = false;
    let newValid = false;
    for (let i of validPages) {
      if (i == newPath) { newValid = true; }
      if (i == prevPath) { prevValid = true; }
    }
    if (prevPath == null) {
      if (newValid) { setShow(true); setAnimate(true); }
    } else {
      if (prevValid && newValid) { setShow(true); setAnimate(false); }
      if (prevValid && !newValid) { setShow(false); setAnimate(false); }
      if (!prevValid && newValid) { setShow(true); setAnimate(true); }
    }
    setPrevPath(newPath);
  }, [location]);
  return (
    <SafeAreaView style={[styles.container,
      theme == 'light' ? colors.light.view : colors.dark.view
    ]}>
      <Home style={styles.page}/>
      <PopIn animate={animate} show={show}>
        {switchPage()}
      </PopIn>
    </SafeAreaView>
  );
}
