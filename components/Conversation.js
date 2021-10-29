import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {messageType} from '../constants';
import commonFuc from '../utils/commonFuc';
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

  // const userName = userProfile.name;

  const handleSenderName = (userName, lastUserName, type) => {
    let senderName = '';

    if (type) {
      senderName = userName === lastUserName ? 'Bạn: ' : `${lastUserName}: `;
    }

    return senderName;
  };

  const handleContent = (lastMessageType, lastMessageContent, isDeleted) => {
    let content = '';
    if (isDeleted) {
      content = 'Tin nhắn đã được thu hồi';
    } else {
      switch (lastMessageType) {
        case messageType.IMAGE:
          content = '[Hình ảnh]';
          break;
        case messageType.STICKER:
          content = '[Nhãn dán]';
          break;
        case messageType.VIDEO:
          const fileNameVideo = commonFuc.getFileName(lastMessageContent);
          content = `[Video] ${fileNameVideo}`;
          break;
        case messageType.FILE:
          const fileName = commonFuc.getFileName(lastMessageContent);
          content = `[File] ${fileName}`;
          break;
        case messageType.VOTE:
          content = `Đã tạo cuộc bình chọn mới ${lastMessageContent}`;
          break;

        default:
          content = lastMessageContent
            ? lastMessageContent
            : '[Không có tin nhắn]';
          break;
      }
    }
    return content;
  };

  // const senderName = type
  //   ? userName === lastMessage?.user.name
  //     ? 'Bạn: '
  //     : `${lastMessage?.user.name}: `
  //   : '';

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
          <ListItem.Title
            style={{
              width: '100%',
              fontWeight: numberUnread > 0 ? 'bold' : 'normal',
            }}>
            {name}
          </ListItem.Title>
          <ListItem.Subtitle
            numberOfLines={1}
            style={[
              {
                width: '100%',
                fontWeight: numberUnread > 0 ? 'bold' : 'normal',
              },
              numberUnread > 0 ? {color: 'black'} : null,
            ]}>{`${handleSenderName(
            userProfile.name,
            lastMessage?.user.name,
            type,
          )}${handleContent(
            lastMessage?.type,
            lastMessage?.content,
            lastMessage?.isDeleted,
          )}`}</ListItem.Subtitle>
        </ListItem.Content>
        <MessageInfo
          createdAt={lastMessage?.createdAt}
          numberUnread={numberUnread}
        />
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
