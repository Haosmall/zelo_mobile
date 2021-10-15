import {useEffect, useRef, useState} from 'react';
import {
  AsyncStorage,
  Keyboard,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  BackHandler,
} from 'react-native';

const DEFAULT_HEIGHT = 280;

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(DEFAULT_HEIGHT);

  async function onKeyboardDidShow(e) {
    const height = e.endCoordinates.height;
    setKeyboardHeight(height);
    const localStorageValue = await AsyncStorage.getItem('keyboardHeight');
    if (!localStorageValue) {
      await AsyncStorage.setItem('keyboardHeight', height.toString());
    }
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);

  return keyboardHeight;
};

export const useAnimatedBottom = (show, height = DEFAULT_HEIGHT) => {
  const animatedValue = useRef(new Animated.Value(0));

  const bottom = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0],
  });

  useEffect(() => {
    if (show) {
      Animated.timing(animatedValue.current, {
        toValue: 1,
        duration: 100,
        // Accelerate then decelerate - https://cubic-bezier.com/#.28,0,.63,1
        easing: Easing.bezier(0.28, 0, 0.63, 1),
        useNativeDriver: false, // 'bottom' is not supported by native animated module
      }).start();
    } else {
      Animated.timing(animatedValue.current, {
        toValue: 0,
        duration: 250,
        // Accelerate - https://easings.net/#easeInCubic
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  return bottom;
};

export const useGoback = navigation => {
  const handleGoBack = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleGoBack);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    };
  }, []);
};
