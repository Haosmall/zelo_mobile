import PropTypes from 'prop-types';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar, ListItem, Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {friendApi} from '../api';
import {friendType} from '../constants';
import {
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  fetchFriends,
  updateFriendStatus,
} from '../redux/friendSlice';
import commonFuc from '../utils/commonFuc';

export default function FriendItem(props) {
  const {type, name, avatar, topDivider, userId} = props;

  const dispatch = useDispatch();

  const buttonTitle =
    type === friendType.FRIEND
      ? 'Nhắn tin'
      : type === friendType.FOLLOWER
      ? 'Đồng ý'
      : type === friendType.YOU_FOLLOW
      ? 'Hủy yêu cầu'
      : 'Kết bạn';

  const handleOnPress = () => {
    switch (type) {
      case friendType.FRIEND:
        console.log('Nhan tin');
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

  return (
    <ListItem
      topDivider={topDivider}
      // bottomDivider={false}
    >
      <Avatar
        rounded
        title={commonFuc.getAcronym(name)}
        overlayContainerStyle={{backgroundColor: '#d9dfeb'}}
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
          title={buttonTitle}
          type={type === friendType.YOU_FOLLOW ? 'outline' : 'solid'}
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
};

FriendItem.defaultProps = {
  type: friendType.FRIEND,
  name: '',
  avatar: '',
  userId: '',
  topDivider: false,
};

const styles = StyleSheet.create({
  buttonWrap: {
    // backgroundColor: "red",
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonStyle: {borderRadius: 50, paddingHorizontal: 15, paddingVertical: 5},
  buttonTitle: {fontSize: 13},
  buttonContainer: {
    marginRight: 10,
  },
});
