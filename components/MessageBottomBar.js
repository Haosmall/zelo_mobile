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
import {useSelector} from 'react-redux';

import {messageApi} from '../api';
import globalStyles, {MAIN_COLOR} from '../styles';

import DocumentPicker from 'react-native-document-picker';
import {ERROR_MESSAGE, messageType} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';
import commonFuc from '../utils/commonFuc';
import Spinner from 'react-native-loading-spinner-overlay';

const MessageBottomBar = props => {
  const {conversationId, showStickyBoard, showImageModal, stickyBoardVisible} =
    props;
  const [messageValue, setMessageValue] = useState('');
  const [singleFile, setSingleFile] = useState(null);
  const {userProfile} = useSelector(state => state.me);
  const {socket} = useSelector(state => state.global);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('upload... 0%');

  const onUploadProgress = percentCompleted => {
    if (percentCompleted < 99) {
      setLoadingText(`upload... ${percentCompleted}%`);
    } else {
      setIsLoading(false);
      setLoadingText('upload... 0%');
    }
  };

  const handleShowStickyBoard = () => {
    showStickyBoard(!stickyBoardVisible);
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
          socket.emit('not-typing', conversationId, userProfile);
        })
        .catch(err => console.log('Send Message Fail'));
    } else {
      console.log('empty');
    }
    setMessageValue('');
  };

  const handleOnChageTextInput = value => {
    setMessageValue(value);

    if (value.length > 0) {
      console.log(conversationId);
      socket.emit('typing', conversationId, userProfile);
    } else {
      socket.emit('not-typing', conversationId, userProfile);
    }
  };

  const handleOnTextInputTouch = () => {
    console.log('conversation-last-view', conversationId);
    socket.emit('conversation-last-view', conversationId);
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res stringify : ' + JSON.stringify(res));
      handleUploadFile(res);
    } catch (err) {
      setSingleFile(null);
      if (DocumentPicker.isCancel(err)) {
        commonFuc.notifyMessage('Đã hủy');
      } else {
        commonFuc.notifyMessage(ERROR_MESSAGE);
        throw err;
      }
    }
  };

  const handleUploadFile = async singleFile => {
    if (singleFile) {
      const fileToUpload = singleFile[0];
      console.log(fileToUpload);

      const type = fileToUpload.type.includes('video')
        ? messageType.VIDEO
        : fileToUpload.type.includes('image')
        ? messageType.IMAGE
        : messageType.FILE;

      const params = {
        type,
        conversationId: conversationId,
      };

      if (fileToUpload.fileSize > 20971520) {
        commonFuc.notifyMessage('Tối đa 20Mb');
      } else {
        try {
          setIsLoading(true);
          const fileBase64 = await RNFetchBlob.fs.readFile(
            fileToUpload.uri,
            'base64',
          );

          const body = {
            fileName: fileToUpload.name.split('.')[0],
            fileExtension: '.' + fileToUpload.name.split('.')[1],
            fileBase64,
          };

          console.log('body:', body);

          messageApi
            .sendFileBase64Message(body, params, onUploadProgress)
            .then(res => {
              console.log('Send Message Success', res);
            })
            .catch(err => {
              console.log('Send Message Fail', err);
              setIsLoading(false);
            });
        } catch (error) {
          commonFuc.notifyMessage('Có lõi xảy ra');
        }
      }
    } else {
      commonFuc.notifyMessage('Chưa chọn file');
    }
  };

  return (
    <View style={styles.footer}>
      <Spinner
        visible={isLoading}
        textContent={loadingText}
        textStyle={globalStyles.spinnerTextStyle}
      />
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
        onChangeText={value => handleOnChageTextInput(value)}
        onFocus={() => showStickyBoard(false)}
        style={styles.textInput}
        multiline
        editable
        onTouchStart={handleOnTextInputTouch}
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
            }}
            onPress={selectFile}>
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
  stickyBoardVisible: PropTypes.bool,
};

MessageBottomBar.defaultProps = {
  conversationId: '',
  showStickyBoard: null,
  showImageModal: null,
  stickyBoardVisible: false,
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
