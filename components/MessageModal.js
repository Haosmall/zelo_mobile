import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {
  Clipboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import messageApi from '../api/messageApi';
import pinMessagesApi from '../api/pinMessagesApi';
import {DEFAULT_MESSAGE_MODAL_VISIBLE, REACTIONS} from '../constants';
import {deleteMessageOnlyMe} from '../redux/messageSlice';
import {fetchPinMessages} from '../redux/pinSlice';
import commonFuc from '../utils/commonFuc';

const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;
const BUTTON_RADIUS = 10;

const MessageModal = props => {
  const {modalVisible, setModalVisible, setPinMessageVisible} = props;
  const {currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );
  const {pinMessages} = useSelector(state => state.pin);

  const messageId = modalVisible.messageId;

  const dispatch = useDispatch();
  useEffect(() => {}, [modalVisible]);

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_MESSAGE_MODAL_VISIBLE);
  };
  const handleCopy = () => {
    Clipboard.setString(modalVisible.messageContent);
    commonFuc.notifyMessage('Đã sao chép');
    handleCloseModal();
  };
  const handleDeleteOnlyMe = async () => {
    dispatch(deleteMessageOnlyMe(messageId));
    handleCloseModal();
    await messageApi.deleteMessageOnlyMe(messageId);
  };
  const handleDelete = async () => {
    await messageApi.deleteMessage(messageId);
    handleCloseModal();
  };
  const handleAddReaction = async type => {
    await messageApi.addReaction(messageId, type);
    handleCloseModal();
  };
  const handlePinMessage = async () => {
    if (pinMessages.length > 3) {
      setPinMessageVisible({
        isVisible: true,
        isError: true,
      });
    } else {
      try {
        const response = await pinMessagesApi.addPinMessage(messageId);

        dispatch(fetchPinMessages({conversationId: currentConversationId}));
        console.log(response);
      } catch (error) {
        commonFuc.notifyMessage('Ghim tin nhắn thất bại');
      }
    }
    handleCloseModal();
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={handleCloseModal}
          style={styles.container}>
          {!modalVisible.isRecall && (
            <SafeAreaView style={styles.reactionContainer}>
              {REACTIONS.map((value, index) => (
                <Button
                  key={index}
                  title={value}
                  containerStyle={styles.reactionButton}
                  type="clear"
                  titleStyle={styles.reactionTitle}
                  onPress={() => handleAddReaction(index + 1)}
                />
              ))}
            </SafeAreaView>
          )}
          <SafeAreaView style={styles.modalView}>
            {!modalVisible.isRecall && (
              <>
                <Button
                  title="Trả lời"
                  containerStyle={{
                    ...styles.button,
                    borderTopStartRadius: BUTTON_RADIUS,
                  }}
                  type="clear"
                  icon={
                    <Icon
                      name="action-undo"
                      type="simple-line-icon"
                      size={22}
                      color="#ab8ef0"
                    />
                  }
                  titleStyle={styles.title}
                  iconPosition="top"
                />
                <Button
                  title="Chuyển tiếp"
                  containerStyle={styles.button}
                  type="clear"
                  icon={
                    <Icon
                      name="action-redo"
                      type="simple-line-icon"
                      size={22}
                      color="#5e9be5"
                    />
                  }
                  titleStyle={styles.title}
                  iconPosition="top"
                />
              </>
            )}
            <Button
              title="Xóa"
              containerStyle={{
                ...styles.button,
                borderTopEndRadius: BUTTON_RADIUS,
              }}
              onPress={handleDeleteOnlyMe}
              type="clear"
              icon={
                <Icon name="trash" type="feather" size={22} color="#c45547" />
              }
              titleStyle={styles.title}
              iconPosition="top"
            />
            {!modalVisible.isRecall && (
              <>
                <Button
                  title="Copy"
                  containerStyle={{
                    ...styles.button,
                    borderBottomStartRadius: BUTTON_RADIUS,
                  }}
                  onPress={handleCopy}
                  type="clear"
                  icon={
                    <Icon
                      name="content-copy"
                      type="material"
                      size={22}
                      color="#899ada"
                    />
                  }
                  titleStyle={styles.title}
                  iconPosition="top"
                />
                {currentConversation?.type && (
                  <Button
                    title="Ghim"
                    containerStyle={styles.button}
                    onPress={handlePinMessage}
                    type="clear"
                    icon={
                      <Icon
                        name="pushpino"
                        type="antdesign"
                        size={22}
                        color="#dc923c"
                      />
                    }
                    titleStyle={styles.title}
                    iconPosition="top"
                  />
                )}
                {modalVisible.isMyMessage && (
                  <Button
                    title="Thu hồi"
                    containerStyle={{
                      ...styles.button,
                      borderBottomEndRadius: BUTTON_RADIUS,
                    }}
                    onPress={handleDelete}
                    type="clear"
                    icon={
                      <Icon
                        name="rotate-ccw"
                        type="feather"
                        size={22}
                        color="#5292af"
                      />
                    }
                    titleStyle={styles.title}
                    iconPosition="top"
                  />
                )}
              </>
            )}
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

MessageModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
  setPinMessageVisible: PropTypes.func,
};

MessageModal.defaultProps = {
  modalVisible: DEFAULT_MESSAGE_MODAL_VISIBLE,
  setModalVisible: null,
  setPinMessageVisible: null,
};

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: 100,
  },
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  reactionContainer: {
    width: '80%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: BUTTON_RADIUS,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  modalView: {
    width: '80%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: BUTTON_RADIUS,
    // padding: 35,
    alignItems: 'center',
    alignContent: 'stretch',
    // justifyContent: "space-between",
    flexDirection: 'row',
    flexWrap: 'wrap',
    // flexGrow: 1,
    // flexBasis: 0,
  },
  reactionButton: {
    // width: "30%",
    borderRadius: BUTTON_RADIUS,
  },
  reactionTitle: {
    fontSize: 20,
  },
  button: {
    width: '33.33%',
    borderRadius: 0,

    // backgroundColor: "red",
  },

  title: {
    fontFamily: 'normal' || 'Arial',
    fontWeight: '100',
    color: 'black',
    fontSize: 13,
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

export default MessageModal;
