import { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'themes/playerlist';

export default function PlayerList() {
  const users = useSelector(state => state.room.users);
  const renderUserList = ({ item }) => {
    return <Text style={styles.username}>{item.username}</Text>
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserList}
      />
    </View>
  );
}
