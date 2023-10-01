import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from 'utils/socket';
import styles from 'themes/chatbox';
import colors from 'themes/colors';

const Message = ({ author, content }) => (
  <View style={styles.message}>
    <Text style={styles.author}>{author}</Text>
    <Text>{content}</Text>
  </View>
);

export default function ChatBox() {
  const theme = useSelector(state => state.theme.mode);
  const username = useSelector(state => state.user.username);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const refInput = useRef(null);
  useEffect(() => {
    function onNewMessage(data) {
      let newMessage = {
        id: data.id, author: data.author, content: data.content
      };
      setMessages(messages => [newMessage, ...messages]);
    }
    socket.on('receiveMessage', onNewMessage);
    return () => {
      socket.off('receiveMessage', onNewMessage);
    };
  }, [username]);
  const sendMessage = () => {
    if (text != '') {
      socket.emit('sendMessage', { content: text, author: username });
      setText('');
      refInput.current.focus();
    }
  };
  const renderMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.author}>{item.author}</Text>
        <Text>{item.content}</Text>
      </View>
    );
  };
  return (
    <View style={styles.chat}>
      <FlatList style={styles.messageContainer}
        data={messages} inverted
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.chatSend}>
        <TextInput
          style={[styles.chatInput, 
            theme == 'light' ? colors.light.text : colors.dark.text
          ]}
          value={text}
          onChangeText={setText}
          ref={refInput}
          placeholder="Type here to chat"
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
         />
        <Pressable style={styles.chatButton} onPress={sendMessage}>
          <Text style={[styles.chatButtonText,
            theme == 'light' ? colors.light.button : colors.dark.button
          ]}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
