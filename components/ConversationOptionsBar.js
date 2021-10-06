import PropTypes from 'prop-types';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {
  DEFAULT_ADD_VOTE_MODAL,
  DEFAULT_RENAME_CONVERSATION_MODAL,
} from '../constants';

const ICON_SIZE = 20;

const ConversationOptionsBar = props => {
  const {name, type, setModalVisible, openAddVoteModal} = props;

  const handleOpenAddVoteModal = () => {
    openAddVoteModal({...DEFAULT_ADD_VOTE_MODAL, isVisible: true});
  };

  return (
    <View style={styles.container}>
      {type && (
        <>
          <Button
            title="Thêm thành viên"
            containerStyle={styles.button}
            type="clear"
            icon={
              <Icon
                name="addusergroup"
                type="antdesign"
                size={ICON_SIZE}
                containerStyle={styles.iconContainer}
              />
            }
            titleStyle={styles.title}
            iconPosition="top"
          />
          <Button
            title="Tạo bình chọn"
            containerStyle={styles.button}
            type="clear"
            icon={
              <Icon
                name="chart"
                type="simple-line-icon"
                size={ICON_SIZE}
                containerStyle={styles.iconContainer}
              />
            }
            titleStyle={styles.title}
            iconPosition="top"
            onPress={handleOpenAddVoteModal}
          />
        </>
      )}
      <Button
        title={type ? 'Đặt tên nhóm' : 'Đặt biệt danh'}
        onPress={() =>
          setModalVisible({
            conversationName: name,
            isVisible: true,
            type,
          })
        }
        containerStyle={styles.button}
        type="clear"
        icon={
          <Icon
            name="edit"
            type="antdesign"
            size={ICON_SIZE}
            containerStyle={styles.iconContainer}
          />
        }
        titleStyle={styles.title}
        iconPosition="top"
      />
      <Button
        title="Tắt thông báo"
        containerStyle={styles.button}
        type="clear"
        icon={
          <Icon
            name="notifications-outline"
            type="ionicon"
            size={ICON_SIZE}
            containerStyle={styles.iconContainer}
          />
        }
        titleStyle={styles.title}
        iconPosition="top"
      />
    </View>
  );
};

ConversationOptionsBar.propTypes = {
  avatars: PropTypes.any,
  name: PropTypes.string,
  type: PropTypes.bool,
  setModalVisible: PropTypes.func,
  openAddVoteModal: PropTypes.func,
};

ConversationOptionsBar.defaultProps = {
  avatars: '',
  name: '',
  type: false,
  setModalVisible: null,
  openAddVoteModal: null,
};
export default ConversationOptionsBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  iconContainer: {
    backgroundColor: '#f3f4f8',
    padding: 8,
    borderRadius: 50,
    marginBottom: 10,
  },
  button: {},
  title: {
    fontWeight: '100',
    color: 'black',
    fontSize: 13,
    width: 70,
  },
});
