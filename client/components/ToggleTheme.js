import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMode } from 'utils/actions';
import styles from 'themes/toggletheme';
import Sun from 'components/Sun';
import Moon from 'components/Moon';

export default function ToggleTheme() {
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const [mode, setMode] = useState(theme.mode);
  const toggleTheme = () => {
    dispatch(toggleMode(theme.mode === 'light' ? 'dark' : 'light'));
  }
  useEffect(() => {
    setMode(theme.mode);
  }, [theme]);
  return (
    <View>
      <TouchableOpacity onPress={toggleTheme} style={styles.container}>
        {mode === 'light' &&
          <Sun width={10} height={10}/>
        }
        {mode === 'dark' &&
          <Moon width={10} height={10}/>
        }
        <Text style={styles.text}>Switch Theme</Text>
        {mode === 'light' &&
          <Sun width={10} height={10}/>
        }
        {mode === 'dark' &&
          <Moon width={10} height={10}/>
        }
      </TouchableOpacity>
    </View>
  );
}
