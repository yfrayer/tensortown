import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    margin: 10,
    width: 80,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#51c1ed',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  title: {
    fontSize: 20,
    margin: 10,
  },
  label: {
    fontSize: 16,
    margin: 10,
    marginBottom: 0,
  },
  field: {
    borderWidth: 1,
    padding: 10,
    width: 250,
    margin: 10,
    borderColor: 'gray',
  },
  link: {
    margin: 10,
    marginBottom: 0,
    color: 'blue',
    fontSize: 16,
    width: 160,
  },
  error: {
    color: 'red',
    margin: 10,
    marginTop: 0,
  },
  text: {
    margin: 10,
    marginBottom: 0,
    fontSize: 16,
  },
});

export default styles;
