import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {messageType} from '../constants';
import CustomAvatar from './CustomAvatar';
import MessageInfo from './MessageInfo';

const Conversation = props => {
  const {
    avatars,
    lastMessage,
    numberUnread,
    handleEnterChat,
    name,
    type,
    totalMembers,
    conversationId,
  } = props;

  const {userProfile} = useSelector(state => state.me);

  const {createdAt, user, isDeleted} = lastMessage;
  const userName = userProfile.name;
  const senderName = type
    ? userName === user.name
      ? 'Bạn: '
      : `${user.name}: `
    : '';

  const lastMessageType = lastMessage.type;

  const content = isDeleted
    ? 'Tin nhắn đã được thu hồi'
    : lastMessageType === messageType.IMAGE
    ? '[Hình ảnh]'
    : lastMessageType === messageType.VOTE
    ? `Đã tạo cuộc bình chọn mới ${lastMessage.content}`
    : lastMessage.content;

  return (
    <View style={{backgroundColor: '#fff'}}>
      <ListItem
        // topDivider={false}
        // bottomDivider={false}
        onPress={() =>
          handleEnterChat(conversationId, name, totalMembers, type, avatars)
        }>
        <CustomAvatar name={name} avatars={avatars} />
        <ListItem.Content>
          <ListItem.Title>{name}</ListItem.Title>
          <ListItem.Subtitle
            numberOfLines={1}>{`${senderName}${content}`}</ListItem.Subtitle>
        </ListItem.Content>
        <MessageInfo createdAt={createdAt} numberUnread={numberUnread} />
      </ListItem>
      <View style={styles.bottomDivider}></View>
    </View>
  );
};

Conversation.propTypes = {
  avatars: PropTypes.any,
  numberUnread: PropTypes.number,
  totalMembers: PropTypes.number,
  handleEnterChat: PropTypes.func,
  lastMessage: PropTypes.object,
  name: PropTypes.string,
  conversationId: PropTypes.string,
  type: PropTypes.bool,
};

Conversation.defaultProps = {
  avatars: '',
  numberUnread: 0,
  totalMembers: 2,
  handleEnterChat: null,
  lastMessage: {},
  name: '',
  conversationId: '',
  type: false,
};

export default Conversation;

const styles = StyleSheet.create({
  bottomDivider: {
    width: '100%',
    backgroundColor: '#E5E6E8',
    height: 1,
    marginLeft: 82,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
