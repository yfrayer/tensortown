import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import styles from 'themes/page';

function PopIn(props) {
  const moveAnim = useRef(new Animated.Value(.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(moveAnim, {
        toValue: 1,
        tension: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, moveAnim, props.animate]);
  console.log(props);
  return (
    <Animated.View style={[
      styles.page,
      props.show ? { visibility: 'visible' } : { visibility: 'hidden' },
      props.animate ? { opacity: fadeAnim, transform: [{scale: moveAnim}] }
      : { opacity: 1, transform: [{scale: 1}] }
    ]}>
      {props.children}
    </Animated.View>
  );
}

export default PopIn;
