import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  portrait: {
    display: 'flex',
    flexDirection: 'column',
  },
  landscape: {
    display: 'flex',
    flexDirection: 'row',
  },
  navrowmain: {
    display: 'flex',
    flexDirection: 'row',
  },
  navmainLandscape: {
    marginLeft: 'auto',
  },
  navrow1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navrow1div: {
    margin: 5,
    display: 'flex',
    justifyContent: 'center',
    color: 'gray',
  },
  navrow2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navbutton: {
    width: 80,
    margin: 5,
    marginTop: 0,
    padding: 5,
    backgroundColor: '#51c1ed',
  },
  navbuttonText: {
    textAlign: 'center',
    color: 'white',
  },
  logo: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
});

export default styles;
