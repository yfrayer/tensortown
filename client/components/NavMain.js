import { Linking, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ToggleTheme from 'components/ToggleTheme';
import Button from 'components/Button';
import styles from 'themes/navmain';

function NavMain(props) {
  const navigate = useNavigate();
  const username = useSelector(state => state.user.username);
  const loggedIn = useSelector(state => state.user.loggedIn);
  const {height, width} = useWindowDimensions();
  const [isPortrait, setIsPortrait] = useState(true);
  const onLoginPress = () => {
    loggedIn ? navigate('/logout') : navigate('/login');
  };
  const onExplorePress = () => {
    navigate('/explore');
  };
  const findLayout = () => {
    if (width < 620) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };
  return (
    <View style={isPortrait ? styles.portrait : styles.landscape}
      onLayout={findLayout}
    >
      {!isPortrait &&
        <View style={styles.logo}>
          <Image
            source={require('assets/tensorlogo.png')}
            style={{width: 236, height: 55}}
          />
        </View>
      }
      <View style={isPortrait ? styles.navmain : styles.navmainLandscape}>
        <View style={styles.navrow1}>
          <Text style={styles.navrow1div}>{username}</Text>
          <Text style={styles.navrow1div}>Mail</Text>
          <Text style={styles.navrow1div}>CoinCount</Text>
          <ToggleTheme/>
        </View>
        <View style={styles.navrow2}>
          <Button text={'Me'}/>
          <Button text={'Shop'}/>
          <Button text={'Explore'} onPress={onExplorePress}/>
          <Button text={loggedIn ? 'Logoff' : 'Login'} onPress={onLoginPress}/>
        </View>
      </View>
    </View>
  );
}

export default NavMain;
