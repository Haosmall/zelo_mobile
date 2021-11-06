import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Button, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi, friendApi} from '../api';
import {ERROR_MESSAGE, friendType} from '../constants';
import {
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  fetchFriends,
  updateFriendStatus,
} from '../redux/friendSlice';
import {
  clearMessagePages,
  fetchConversations,
  fetchListLastViewer,
  fetchMembers,
  updateCurrentConversation,
} from '../redux/messageSlice';
import {OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc, {handleCreateChat} from '../utils/commonFuc';

export default function FriendItem(props) {
  const {type, name, avatar, topDivider, userId, navigation, handleGroup} =
    props;

  const {currentConversationId} = useSelector(state => state.message);

  const dispatch = useDispatch();

  const buttonTitle =
    type === friendType.FRIEND
      ? 'Nhắn tin'
      : type === friendType.FOLLOWER
      ? 'Đồng ý'
      : type === friendType.YOU_FOLLOW
      ? 'Hủy yêu cầu'
      : 'Kết bạn';

  const getButtonTitle = () => {
    let title = 'Kết bạn';
    switch (type) {
      case friendType.FRIEND:
        title = 'Nhắn tin';
        break;
      case friendType.FOLLOWER:
        title = 'Đồng ý';
        break;
      case friendType.YOU_FOLLOW:
        title = 'Hủy yêu cầu';
        break;
      case friendType.DONT_HAVE_ACCOUNT:
        title = 'Mời';
        break;
      case friendType.ADD_TO_GROUP:
        title = 'Thêm';
        break;
      case friendType.REMOVE_FROM_GROUP:
        title = 'Xóa';
        break;
      case 'DETAILS':
        title = 'Chi tiết';
        break;
      default:
        title = 'Kết bạn';
        break;
    }
    return title;
  };

  const handleOnPress = () => {
    switch (type) {
      case friendType.FRIEND:
        console.log('Nhan tin');
        handleCreateChat(userId, navigation, dispatch, currentConversationId);
        break;
      case friendType.FOLLOWER:
        handleAcceptFriend();
        console.log('Dong y');
        break;
      case friendType.YOU_FOLLOW:
        handleDeleteMyFriendRequest();
        console.log('Huy yeu cau');
        break;
      case friendType.NOT_FRIEND:
        console.log('Ket ban');
        handleAddFriendRequest();
        break;
      case friendType.ADD_TO_GROUP:
        console.log('Them Vao nhom');
        handleGroup();
        break;
      case friendType.REMOVE_FROM_GROUP:
        console.log('Xoa khoi nhom');
        handleGroup();
        break;
      case friendType.DONT_HAVE_ACCOUNT:
        console.log('Moi tao tk');
        handleAddFriendRequest();
        break;
      case 'DETAILS':
        break;
      default:
        console.log('df Nhan tin');
        break;
    }
  };

  const handleAddFriendRequest = async () => {
    try {
      const response = await friendApi.addFriendRequest(userId);
      console.log('gui ket ban thanh cong');
      dispatch(updateFriendStatus(friendType.YOU_FOLLOW));
      dispatch(addNewFriendRequest());
    } catch (error) {
      console.log('Loi');
    }
  };
  const handleDeleteMyFriendRequest = async () => {
    try {
      const response = await friendApi.deleteMyFriendRequest(userId);
      console.log('huy yeu cau thanh cong');
      dispatch(updateFriendStatus(friendType.NOT_FRIEND));
      dispatch(cancelMyFriendRequest(userId));
    } catch (error) {
      console.log('Loi', error);
    }
  };

  const handleDeleteFriendRequest = async () => {
    try {
      const response = await friendApi.deleteFriendRequest(userId);
      console.log('Tu choi thanh cong');
      dispatch(updateFriendStatus(friendType.NOT_FRIEND));
      dispatch(deleteFriendRequest(userId));
    } catch (error) {
      console.log('Loi');
    }
  };
  const handleAcceptFriend = async () => {
    try {
      const response = await friendApi.acceptFriend(userId);
      console.log('Dong y thanh cong');
      dispatch(updateFriendStatus(friendType.FRIEND));
      dispatch(deleteFriendRequest(userId));
      dispatch(fetchFriends());
    } catch (error) {
      console.log('Loi');
    }
  };

  const handleCreateChat = async userId => {
    try {
      const response = await conversationApi.addConversation(userId);
      await dispatch(fetchConversations());
      // if (response?.isExists) {
      handleEnterChat(response._id);
      // }
    } catch (error) {
      console.error('CreateChat', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleEnterChat = conversationId => {
    dispatch(clearMessagePages());
    dispatch(updateCurrentConversation({conversationId}));
    dispatch(fetchListLastViewer({conversationId}));
    dispatch(fetchMembers({conversationId}));
    console.log('conver: ', conversationId);
    navigation.navigate('Nhắn tin', {
      conversationId,
    });
  };

  const handleInvite = userId => {
    console.log('Moi tao tk');
  };

  return (
    <ListItem
      topDivider={topDivider}
      // bottomDivider={false}
    >
      <Avatar
        rounded
        title={commonFuc.getAcronym(name)}
        overlayContainerStyle={{backgroundColor: OVERLAY_AVATAR_COLOR}}
        source={
          avatar.length > 0
            ? {
                uri: avatar,
              }
            : null
        }
        size="medium"
      />
      <ListItem.Content>
        <ListItem.Title numberOfLines={1}>{name}</ListItem.Title>
        {/* <ListItem.Subtitle
                        numberOfLines={
                          1
                        }>{`${senderName}${content}`}</ListItem.Subtitle> */}
      </ListItem.Content>
      {/* <MessageInfo
                      createdAt={createdAt}
                      numberUnread={numberUnread}
                    /> */}
      <View style={styles.buttonWrap}>
        {type === friendType.FOLLOWER && (
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitle}
            title="Từ chối"
            type="outline"
            onPress={handleDeleteFriendRequest}
          />
        )}
        <Button
          title={getButtonTitle()}
          type={
            type === friendType.YOU_FOLLOW ||
            type === friendType.REMOVE_FROM_GROUP ||
            type === friendType.DONT_HAVE_ACCOUNT
              ? 'outline'
              : 'solid'
          }
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitle}
          onPress={handleOnPress}
        />
      </View>
    </ListItem>
  );
}

FriendItem.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  avatar: PropTypes.string,
  userId: PropTypes.string,
  topDivider: PropTypes.bool,
  handleGroup: PropTypes.func,
};

FriendItem.defaultProps = {
  type: friendType.FRIEND,
  name: '',
  avatar: '',
  userId: '',
  topDivider: false,
  handleGroup: null,
};

const styles = StyleSheet.create({
  buttonWrap: {
    // backgroundColor: "red",
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonStyle: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    minWidth: 60,
  },
  buttonTitle: {fontSize: 13},
  buttonContainer: {
    marginRight: 10,
    minWidth: 60,
  },
});
