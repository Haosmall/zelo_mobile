import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Animated, ScrollView, StyleSheet, Text} from 'react-native';
import {useAnimatedBottom} from '../hooks';

const StickyBoard = props => {
  const {height, visible, setVisible} = props;

  const bottom = useAnimatedBottom(visible, height);

  const handleClose = () => {
    setVisible(false);
    console.log('You pressed the backdrop!');
  };

  return (
    <Animated.View
      style={[
        {backgroundColor: 'purple', height: visible ? height : 0},
        {bottom},
      ]}>
      <ScrollView
      // contentContainerStyle={[
      // 	{ backgroundColor: "purple", height: keyboardHeight },
      // ]}
      >
        <Text style={{color: 'white'}}>HELOOOO!!!</Text>
      </ScrollView>
    </Animated.View>
  );
};
export default StickyBoard;

StickyBoard.propTypes = {
  height: PropTypes.number,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
};

StickyBoard.defaultProps = {
  keyboardHeight: 280,
  visible: false,
  setVisible: null,
};
const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: 100,
  },
  modalView: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    // padding: 35,
  },

  title: {
    fontFamily: 'normal' || 'Arial',
    fontWeight: '100',
    color: 'black',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
