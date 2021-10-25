import {CardStyleInterpolators} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions, StyleSheet} from 'react-native';
// import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const MAIN_COLOR = '#0068FF';
export const GREY_COLOR = '#889197';
export const OVERLAY_AVATAR_COLOR = '#d9dfeb';

export const globalScreenOptions = {
  headerStyle: {backgroundColor: MAIN_COLOR},
  headerBackground: () => (
    <LinearGradient
      // Background Linear Gradient
      colors={['#257afe', '#00bafa']}
      style={StyleSheet.absoluteFill}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    />
  ),
  headerTitleStyle: {color: 'white'},
  headerTintColor: 'white',
  gestureEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zelo: {
    textAlign: 'center',
    color: '#4c92ff',
    fontWeight: 'bold',
    fontSize: 80,
    // marginTop: 80,
    // marginBottom: 30,
  },

  inputContainer: {
    width: 300,
  },

  input: {
    // color: "white",
  },

  button: {
    marginTop: 20,
    marginHorizontal: 10,
  },

  forgotPassword: {
    marginTop: 20,
    marginHorizontal: 10,
    borderWidth: 0,
  },
  errorText: {
    marginTop: -10,
    marginLeft: 10,
    color: 'red',
  },
  spinnerTextStyle: {
    color: 'white',
  },
  iconBadge: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 16,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
  },
  badgeElement: {color: 'white', fontSize: 10},
  imageMessage: {
    width: '100%',
    aspectRatio: 76 / 135,
  },
});

export default globalStyles;
