import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {messageType} from '../constants';

const ReceiverMessage = props => {
  const {
    message,
    handleOpenOptionModal,
    handleShowReactDetails,
    content,
    time,
    reactVisibleInfo,
    reactLength,
  } = props;

  const {_id, isDeleted, type} = message;

  const contentStyle = isDeleted
    ? styles.messageRecall
    : message.messageContent;

  return (
    <TouchableWithoutFeedback
      onLongPress={handleOpenOptionModal}
      delayLongPress={500}>
      <View style={styles.receiverContainer}>
        <View style={styles.receiver} key={_id}>
          <Text style={contentStyle}>{content}</Text>
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
  );
};

ReceiverMessage.propTypes = {
  message: PropTypes.object,
  handleOpenOptionModal: PropTypes.func,
  handleShowReactDetails: PropTypes.func,
  content: PropTypes.string,
  time: PropTypes.string,
  reactVisibleInfo: PropTypes.string,
  reactLength: PropTypes.number,
};

ReceiverMessage.defaultProps = {
  message: {},
  handleOpenOptionModal: null,
  handleShowReactDetails: null,
  content: '',
  time: '',
  reactVisibleInfo: '',
  reactLength: 0,
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
    // backgroundColor: "red",
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
});
