import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';

import {messageApi} from '../api';
import {MAIN_COLOR} from '../styles';

const MessageBottomBar = props => {
  const {conversationId, showStickyBoard, showImageModal} = props;
  const [messageValue, setMessageValue] = useState('');

  const handleShowStickyBoard = () => {
    showStickyBoard(true);
    Keyboard.dismiss();
  };

  const handleSendMessage = async () => {
    const isNotEmpty = messageValue.replace(/\s/g, '').length;
    if (isNotEmpty) {
      Keyboard.dismiss();
      const newMessage = {
        content: messageValue,
        type: 'TEXT',
        conversationId: conversationId,
      };
      console.log({newMessage});
      messageApi
        .sendMessage(newMessage)
        .then(res => {
          console.log('Send Message Success');
        })
        .catch(err => console.log('Send Message Fail'));
    } else {
      console.log('empty');
    }
    setMessageValue('');
  };
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={handleShowStickyBoard}
        style={{
          paddingBottom: 8,
        }}>
        <View>
          <Icon name="sticker-emoji" type="material-community" size={22} />
        </View>
      </TouchableOpacity>
      <TextInput
        placeholder="Tin nhắn, @"
        value={messageValue}
        onChangeText={value => setMessageValue(value)}
        onFocus={() => showStickyBoard(false)}
        style={styles.textInput}
        multiline
        editable
      />
      {messageValue ? (
        <TouchableOpacity
          style={{
            paddingBottom: 8,
          }}
          onPress={handleSendMessage}>
          <Icon name="send" type="ionicon" size={22} color={MAIN_COLOR} />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={{
              paddingBottom: 8,
              marginRight: 10,
            }}>
            <Icon name="ellipsis-horizontal-outline" type="ionicon" size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingBottom: 8,
            }}
            onPress={() => showImageModal(true)}>
            <Icon name="image-outline" type="ionicon" size={22} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MessageBottomBar;

MessageBottomBar.propTypes = {
  conversationId: PropTypes.string,
  showStickyBoard: PropTypes.func,
  showImageModal: PropTypes.func,
};

MessageBottomBar.defaultProps = {
  conversationId: '',
  showStickyBoard: null,
  showImageModal: null,
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D0D2D3',
    backgroundColor: '#FFF',
    zIndex: 300, // works on ios
    elevation: 300, // works on android
  },
  textInput: {
    bottom: 0,
    // maxHeight: 282.3529357910156,
    maxHeight: 110,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#FFF',
    borderWidth: 1,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
  },
  headerSubTitle: {
    color: '#fff',
    fontSize: 12,
  },
});
