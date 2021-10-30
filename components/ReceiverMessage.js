import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Image} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {useSelector} from 'react-redux';
import {messageType} from '../constants';
import globalStyles from '../styles';
import commonFuc, {checkPermissionDownloadFile} from '../utils/commonFuc';
import FileMessage from './FileMessage';
import MessageNotifyDivider from './MessageNotifyDivider';
import RNUrlPreview from 'react-native-url-preview';

import VideoMessage from './VideoMessage';

const ReceiverMessage = props => {
  const {
    message,
    handleOpenOptionModal,
    handleShowReactDetails,
    content,
    time,
    reactVisibleInfo,
    reactLength,
    handleViewImage,
    isLastMessage,
  } = props;

  const {_id, isDeleted, type} = message;

  const {listLastViewer} = useSelector(state => state.message);
  const {currentUserId} = useSelector(state => state.global);

  const contentStyle = isDeleted
    ? styles.messageRecall
    : message.messageContent;

  const checkLastView = () => {
    let usersViewed = [];
    if (!isLastMessage) {
      return usersViewed;
    }

    const removeCurrentUser = listLastViewer.filter(
      lastViewerEle => currentUserId !== lastViewerEle.user._id,
    );

    removeCurrentUser.forEach(lastViewerEle => {
      const {lastView, user} = lastViewerEle;

      if (new Date(lastView) >= new Date(message?.createdAt))
        usersViewed.push(user);
    });

    return usersViewed;
  };

  return (
    <View>
      {type === messageType.NOTIFY ? (
        <MessageNotifyDivider message={message} />
      ) : (
        <TouchableWithoutFeedback
          onLongPress={handleOpenOptionModal}
          delayLongPress={500}>
          <View style={styles.receiverContainer}>
            <View style={styles.receiver} key={_id}>
              {type === messageType.IMAGE ? (
                <Image
                  source={{uri: content}}
                  style={globalStyles.imageMessage}
                  onPress={() =>
                    handleViewImage(content, message.user.name, true)
                  }
                  onLongPress={handleOpenOptionModal}
                  delayLongPress={500}
                />
              ) : type === messageType.STICKER ? (
                <Image
                  source={{uri: content}}
                  style={globalStyles.stickerMessage}
                  onLongPress={handleOpenOptionModal}
                  delayLongPress={500}
                />
              ) : type === messageType.FILE ? (
                <FileMessage
                  content={content}
                  handleOpenOptionModal={handleOpenOptionModal}
                />
              ) : type === messageType.VIDEO ? (
                <TouchableOpacity
                  style={globalStyles.fileMessage}
                  onLongPress={handleOpenOptionModal}
                  delayLongPress={500}
                  onPress={() =>
                    handleViewImage(content, message.user.name, false)
                  }>
                  <View style={globalStyles.video}>
                    <Icon name="play" type="antdesign" color="#fff" size={30} />
                  </View>
                  <Text>{commonFuc.getFileName(content)}</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={contentStyle}>{content}</Text>
                  <RNUrlPreview text={content} />
                </View>
              )}
              <Text style={styles.messageTime}>{time}</Text>
            </View>
            {reactLength > 0 && (
              <TouchableOpacity
                style={{...styles.reactionContainer, right: 25}}
                onPress={handleShowReactDetails}>
                <Text style={styles.reactionText}>{reactVisibleInfo}</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
      {checkLastView().length > 0 && (
        <View style={styles.lastView}>
          <Text style={{fontSize: 12}}>Đã xem</Text>
        </View>
      )}
    </View>
  );
};

ReceiverMessage.propTypes = {
  message: PropTypes.object,
  handleOpenOptionModal: PropTypes.func,
  handleShowReactDetails: PropTypes.func,
  handleViewImage: PropTypes.func,
  content: PropTypes.string,
  time: PropTypes.string,
  reactVisibleInfo: PropTypes.string,
  reactLength: PropTypes.number,
  isLastMessage: PropTypes.bool,
};

ReceiverMessage.defaultProps = {
  message: {},
  handleOpenOptionModal: null,
  handleShowReactDetails: null,
  handleViewImage: null,
  content: '',
  time: '',
  reactVisibleInfo: '',
  reactLength: 0,
  isLastMessage: false,
};
export default ReceiverMessage;

const MIN_WIDTH_MESSAGE = 100;

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 0,
    left: -40,
  },
  receiverContainer: {
    paddingBottom: 15,
    // backgroundColor: 'red',
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    position: 'relative',
    maxWidth: '75%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  receiver: {
    padding: 10,
    paddingVertical: 5,
    backgroundColor: '#D5F0FF',
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginRight: 15,
    // marginVertical: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CADEE9',
    maxWidth: '75%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  senderContainer: {
    paddingBottom: 15,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E6E7',
    maxWidth: '73%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  sender: {
    padding: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderRadius: 10,
    // marginVertical: 10,
    marginLeft: 50,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E6E7',
    maxWidth: '73%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  messageContent: {fontSize: 16},

  messageRecall: {fontSize: 16, color: '#909CA5'},

  messageName: {color: '#218A7E', fontSize: 14, marginBottom: 4},

  messageTime: {color: '#909CA5', fontSize: 12},

  reactionContainer: {
    borderColor: '#E5E6E7',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 3,
    right: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reactionText: {fontSize: 11},
  lastView: {
    alignSelf: 'flex-end',
    marginRight: 15,
    // backgroundColor: 'cyan',
    marginTop: -3,
    marginBottom: 8,
  },
});
