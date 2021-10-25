import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';
import {DEFAULT_COVER_IMAGE, messageType} from '../constants';
import commonFuc from '../utils/commonFuc';
import dateUtils from '../utils/dateUtils';
import ReceiverMessage from './ReceiverMessage';
import SenderMessage from './SenderMessage';
import VoteMessage from './VoteMessage';

function ChatMessage(props) {
  const {
    message,
    isMyMessage,
    setModalVisible,
    showReactDetails,
    navigation,
    setImageProps,
  } = props;

  const {_id, createdAt, user, isDeleted, reacts, type} = message;
  const time = dateUtils.getTime(createdAt);
  const reactLength = reacts ? reacts.length : 0;

  const reactStr = reacts ? commonFuc.getReactionVisibleInfo(reacts) : '';
  const reactVisibleInfo = `${reactStr} ${reactLength}`;

  const content = isDeleted ? 'Tin nhắn đã được thu hồi' : message.content;

  const handleOpenOptionModal = () => {
    const obj = {
      isVisible: true,
      isRecall: isDeleted ? true : false,
      isMyMessage,
      messageId: _id,
      messageContent: content,
    };
    setModalVisible(obj);
  };
  const handleShowReactDetails = () => {
    const obj = {
      isVisible: true,
      messageId: _id,
      reacts,
    };
    showReactDetails(obj);
  };

  const handleViewImage = (url, userName) => {
    setImageProps({
      isVisible: true,
      userName: userName,
      imageUrl: url || DEFAULT_COVER_IMAGE,
    });
  };

  return type === messageType.VOTE ? (
    <VoteMessage message={message} navigation={navigation} />
  ) : isMyMessage ? (
    <ReceiverMessage
      message={message}
      handleOpenOptionModal={handleOpenOptionModal}
      handleShowReactDetails={handleShowReactDetails}
      content={content}
      time={time}
      reactVisibleInfo={reactVisibleInfo}
      reactLength={reactLength}
      handleViewImage={handleViewImage}
    />
  ) : (
    <SenderMessage
      message={message}
      handleOpenOptionModal={handleOpenOptionModal}
      handleShowReactDetails={handleShowReactDetails}
      content={content}
      time={time}
      reactVisibleInfo={reactVisibleInfo}
      reactLength={reactLength}
      handleViewImage={handleViewImage}
    />
  );
}

ChatMessage.propTypes = {
  message: PropTypes.object,
  navigation: PropTypes.object,
  currentUserId: PropTypes.string,
  isMyMessage: PropTypes.bool,
  setModalVisible: PropTypes.func,
  showReactDetails: PropTypes.func,
  setImageProps: PropTypes.func,
};

ChatMessage.defaultProps = {
  message: {},
  navigation: {},
  currentUserId: '',
  isMyMessage: false,
  setModalVisible: null,
  showReactDetails: null,
  setImageProps: null,
};

export default ChatMessage;
