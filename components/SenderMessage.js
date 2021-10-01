import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {messageType} from '../constants';
import commonFuc from '../utils/commonFuc';
import MessageNotifyDivider from './MessageNotifyDivider';

const SenderMessage = props => {
  const {
    message,
    handleOpenOptionModal,
    handleShowReactDetails,
    content,
    time,
    reactVisibleInfo,
    reactLength,
  } = props;

  const {_id, user, isDeleted, type} = message;

  const contentStyle = isDeleted
    ? styles.messageRecall
    : message.messageContent;

  return type === messageType.NOTIFY ? (
    <MessageNotifyDivider message={message} isReceiverMessage={false} />
  ) : (
    <TouchableWithoutFeedback
      onLongPress={handleOpenOptionModal}
      delayLongPress={500}>
      <View style={styles.senderContainer}>
        <View style={styles.sender} key={_id}>
          <Avatar
            title={commonFuc.getAcronym(user.name)}
            rounded
            source={{uri: user.avatar}}
            containerStyle={styles.avatar}
          />
          <Text style={styles.messageName}>{user.name}</Text>
          <Text style={contentStyle}>{content}</Text>
          <Text style={styles.messageTime}>{time}</Text>
        </View>
        {reactLength > 0 && (
          <TouchableOpacity
            style={styles.reactionContainer}
            onPress={handleShowReactDetails}>
            <Text style={styles.reactionText}>{reactVisibleInfo}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

SenderMessage.propTypes = {
  message: PropTypes.object,
  handleOpenOptionModal: PropTypes.func,
  handleShowReactDetails: PropTypes.func,
  content: PropTypes.string,
  time: PropTypes.string,
  reactVisibleInfo: PropTypes.string,
  reactLength: PropTypes.number,
};

SenderMessage.defaultProps = {
  message: {},
  handleOpenOptionModal: null,
  handleShowReactDetails: null,
  content: '',
  time: '',
  reactVisibleInfo: '',
  reactLength: 0,
};
export default SenderMessage;

const MIN_WIDTH_MESSAGE = 100;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: '100%',
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: -40,
  },

  senderContainer: {
    paddingBottom: 15,

    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    position: 'relative',
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: 'transparent',
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
});
