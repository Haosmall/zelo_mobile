import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {messageApi} from '../../api';
import {
  DEFAULT_MESSAGE_MODAL_VISIBLE,
  DEFAULT_REACTION_MODAL_VISIBLE,
  REACTIONS,
} from '../../constants';

const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;
const BUTTON_RADIUS = 10;

const ReactionModal = props => {
  const {reactProps, setReactProps} = props;

  const handleCloseModal = () => {
    setReactProps(DEFAULT_REACTION_MODAL_VISIBLE);
  };

  const handleAddReaction = async type => {
    await messageApi.addReaction(reactProps.messageId, type);
    handleCloseModal();
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={reactProps.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={handleCloseModal}
          style={styles.container}>
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
          <SafeAreaView style={styles.modalView}>
            <Text
              style={{
                backgroundColor: 'red',
                width: '100%',
                padding: 15,
                textAlign: 'center',
              }}>{`${reactProps.reacts.length} người đã bày tỏ cảm xúc`}</Text>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

ReactionModal.propTypes = {
  reactProps: PropTypes.object,
  setReactProps: PropTypes.func,
};

ReactionModal.defaultProps = {
  reactProps: DEFAULT_MESSAGE_MODAL_VISIBLE,
  setReactProps: null,
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
    justifyContent: 'flex-end',
  },
  reactionContainer: {
    width: '80%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 50,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  modalView: {
    width: '100%',
    height: 280,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 35,
    alignItems: 'center',
    alignContent: 'flex-start',
    // justifyContent: "space-between",
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
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
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

export default ReactionModal;
