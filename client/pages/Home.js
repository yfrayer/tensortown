import { View, Text } from 'react-native';
import ChatBox from 'components/ChatBox';
import NavMain from 'components/NavMain';
import PlayerList from 'components/PlayerList';
import Room from 'components/Room';
import styles from 'themes/home';

export default function Home(props) {
  return (
    <View>
      <View style={styles.canvas}>
        <Room/>
      </View>
      <NavMain/>
      <ChatBox/>
      <PlayerList/>
    </View>
  );
};
