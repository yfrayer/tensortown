import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    top: Platform.OS === 'android' ? 25: 0,
    width: '100%',
    position: 'relative',
  },
  page: {
    position: 'absolute',
  },
});

export default styles;
