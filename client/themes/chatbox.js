import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  chat: {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'none',
  },
  message: {
    wordBreak: 'break-word',
    margin: 5,
    border: '1px, black, solid',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  messageContainer: {
    border: '1px, black, solid',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    width: 300,
    height: 495,
  },
  chatSend: {
    display: 'flex',
    flexDirection: 'row',
    width: 300,
  },
  chatInput: {
    width: 220,
    pointerEvents: 'auto',
  },
  chatButton: {
    width: 80,
    pointerEvents: 'auto',
  },
  chatButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  author: {
    color: 'blue',
  },
});

export default styles;
