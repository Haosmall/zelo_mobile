import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Divider, Icon, Input, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {DEFAULT_ADD_VOTE_MODAL} from '../constants';
import {GREY_COLOR} from '../styles';

const AddVoteModal = props => {
  const {modalVisible, setModalVisible} = props;
  const {pinMessages} = useSelector(state => state.pin);
  const {currentConversationId} = useSelector(state => state.message);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_ADD_VOTE_MODAL);
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible.isVisible}
        onRequestClose={handleCloseModal}
        avoidKeyboard={false}>
        {/* <TouchableOpacity
          activeOpacity={1}
          style={styles.container}></TouchableOpacity> */}

        <KeyboardAvoidingView style={styles.modalView} behavior="height">
          <View style={styles.header}>
            <Button
              icon={
                <Icon
                  name="chart"
                  type="simple-line-icon"
                  color="white"
                  size={18}
                />
              }
              disabled
              disabledStyle={{
                backgroundColor: '#3edc95',
                borderRadius: 50,
                marginBottom: 5,
              }}
            />

            <Text style={styles.title}>Tạo bình chọn mới</Text>
          </View>
          <Divider />
          <ScrollView>
            <View style={styles.body}>
              <Input placeholder="Đặt câu hỏi bình chọn" />
              <Input
                placeholder="Phương án 1"
                style={styles.option}
                containerStyle={styles.optionContainer}
                renderErrorMessage={false}
              />
              <Input
                placeholder="Phương án 2"
                style={styles.option}
                containerStyle={styles.optionContainer}
                renderErrorMessage={false}
              />
              <Input
                placeholder="Phương án 2"
                style={styles.option}
                containerStyle={styles.optionContainer}
                renderErrorMessage={false}
              />
              <Input
                placeholder="Phương án 2"
                style={styles.option}
                containerStyle={styles.optionContainer}
                renderErrorMessage={false}
              />
              <Input
                placeholder="Phương án 2"
                style={styles.option}
                containerStyle={styles.optionContainer}
                renderErrorMessage={false}
              />
              <Input
                placeholder="Phương án 2"
                style={styles.option}
                containerStyle={styles.optionContainer}
                renderErrorMessage={false}
              />
              <Button title="Thêm phương án" type="clear" />
            </View>
            <View style={styles.footer}>
              <Button
                title="Tạo"
                containerStyle={styles.buttonClose}
                onPress={handleCloseModal}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

AddVoteModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
};

AddVoteModal.defaultProps = {
  modalVisible: DEFAULT_ADD_VOTE_MODAL,
  setModalVisible: null,
};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: 10,
  },
  centeredView: {},
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    // backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  body: {
    backgroundColor: 'cyan',
    width: '100%',
    paddingBottom: 10,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  footer: {
    backgroundColor: 'pink',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,

    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    width: '100%',
    borderRadius: 50,
  },
  option: {
    fontSize: 12,
    // backgroundColor: 'red',
    marginVertical: 0,
    paddingVertical: 5,
  },
  optionContainer: {
    // backgroundColor: 'blue',
  },
});

export default AddVoteModal;
