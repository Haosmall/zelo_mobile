import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {messageType} from '../constants';
import {Icon} from 'react-native-elements';
import {MAIN_COLOR} from '../styles';

const MessageNotifyDivider = props => {
  const {message, isReceiverMessage} = props;
  const {type, content, user} = message;

  const contentLowercase =
    content === 'PIN_MESSAGE'
      ? 'đã ghim một tin nhắn'
      : content === 'NOT_PIN_MESSAGE'
      ? 'đã bỏ ghim một tin nhắn'
      : content.charAt(0).toLocaleLowerCase() + content.slice(1);
  const contentWithSenderName = `<p> ${
    isReceiverMessage ? 'Bạn' : user.name
  } ${contentLowercase}</p`;

  const icon = contentLowercase.includes('đã ghim')
    ? {name: 'pin-outline', type: 'material-community', color: '#dc923c'}
    : contentLowercase.includes('đã bỏ ghim')
    ? {name: 'pin-off-outline', type: 'material-community', color: 'red'}
    : {name: 'edit', type: 'material', color: '#4cacfc'};
  // ? {name: 'pushpino', type: 'antdesign', color: '#dc923c'}
  // : contentLowercase.includes('đã bỏ ghim')
  // ? {name: 'pushpino', type: 'antdesign', color: 'red'}
  // : {name: 'edit', type: 'material', color: '#4cacfc'};

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <Icon name={icon.name} type={icon.type} size={14} color={icon.color} />
        {type === messageType.NOTIFY ? (
          <HTMLView
            value={contentWithSenderName}
            stylesheet={{p: {fontSize: 13, flexWrap: 'wrap'}}}
          />
        ) : (
          <Text style={styles.text}>{contentWithSenderName}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
MessageNotifyDivider.propTypes = {
  message: PropTypes.object,
  isReceiverMessage: PropTypes.bool,
};
MessageNotifyDivider.defaultProps = {
  message: {},
  isReceiverMessage: true,
};

export default MessageNotifyDivider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfdff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    // marginVertical: 5,
    marginBottom: 10,
  },
  text: {
    color: '#000',
    fontSize: 12,
    textAlignVertical: 'center',
  },
});
