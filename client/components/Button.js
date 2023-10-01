import { TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'themes/button';
import colors from 'themes/colors';

export default function Button(props) {
  const theme = useSelector(state => state.theme.mode);
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.button,
      theme == 'light' ? colors.light.button : colors.dark.button
    ]}>
      <Text style={[styles.buttonText,
        theme == 'light' ? colors.light.buttonText : colors.dark.buttonText
      ]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
