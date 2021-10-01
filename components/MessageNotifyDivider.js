import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {messageType} from '../constants';

const MessageNotifyDivider = props => {
  const {message, isReceiverMessage} = props;
  const {type, content, user} = message;

  const contentLowercase =
    content.charAt(0).toLocaleLowerCase() + content.slice(1);
  const contentWithSenderName = `<p>${
    isReceiverMessage ? 'Bạn' : user.name
  } ${contentLowercase}</p`;

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
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
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  text: {
    color: '#000',
    fontSize: 12,
    textAlignVertical: 'center',
  },
});
