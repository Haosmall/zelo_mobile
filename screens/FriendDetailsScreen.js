import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, Image, ListItem} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {ScrollView} from 'react-native-gesture-handler';
// import defaultCoverImage from '../assets/default-cover-image.jpg';
// import ImageView from 'react-native-image-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useDispatch, useSelector} from 'react-redux';
import {friendApi} from '../api';
import {DEFAULT_COVER_IMAGE, friendType} from '../constants';
import {
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  fetchFriends,
  updateFriendStatus,
} from '../redux/friendSlice';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function FriendDetailsScreen({navigation}) {
  const {searchFriend} = useSelector(state => state.friend);
  const dispatch = useDispatch();
  const AVATAR =
    'https://wiki.tino.org/wp-content/uploads/2020/10/react-native-final-file.jpg';

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageView, setImageView] = useState([]);

  // const buttonTitle = 'Nhắn tin';
  const friendStatus = searchFriend.status;
  const buttonTitle =
    friendStatus === friendType.FRIEND
      ? 'Nhắn tin'
      : friendStatus === friendType.FOLLOWER
      ? 'Đồng ý'
      : friendStatus === friendType.YOU_FOLLOW
      ? 'Hủy yêu cầu'
      : 'Kết bạn';

  useEffect(() => {
    // dispatch(fetchFriends({}));
  }, []);

  const handleOnPress = () => {
    switch (friendStatus) {
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
      const userId = searchFriend._id;
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
      const userId = searchFriend._id;
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
      const userId = searchFriend._id;
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
      const userId = searchFriend._id;
      const response = await friendApi.acceptFriend(userId);
      console.log('Dong y thanh cong');
      dispatch(updateFriendStatus(friendType.FRIEND));
      dispatch(deleteFriendRequest(userId));
      dispatch(fetchFriends());
    } catch (error) {
      console.log('Loi');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: searchFriend.name,
    });
  }, [navigation]);

  const handleViewImage = url => {
    const image = [
      {
        url: url || DEFAULT_COVER_IMAGE,
      },
    ];

    setImageView(image);
    setIsImageViewVisible(true);
  };

  const handleDoB = () => {
    let dob = '';

    if (friendStatus !== friendType.FRIEND) {
      return '**********';
    }
    if (searchFriend.dateOfBirth) {
      const day = ('00' + searchFriend.dateOfBirth.day).slice(-2);
      const month = ('00' + searchFriend.dateOfBirth.month).slice(-2);
      const year = searchFriend.dateOfBirth.year;
      dob = `${day}/${month}/${year}`;
    }
    return dob;
  };

  const handleEmail = () => {
    const username = searchFriend.username;
    let email = '';
    if (friendStatus !== friendType.FRIEND) {
      return '**********';
    }
    if (username.includes('@')) {
      email = searchFriend.username;
    }
    return email;
  };
  const handlePhoneNumber = () => {
    const username = searchFriend.username;
    let phoneNumber = '';

    if (!username.includes('@')) {
      phoneNumber = searchFriend.username;
      if (friendStatus !== friendType.FRIEND) {
        phoneNumber = '**********';
      }
    }

    return phoneNumber;
  };

  const handleCloseModal = () => {
    setIsImageViewVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{uri: searchFriend?.coverImage || DEFAULT_COVER_IMAGE}}
            style={styles.coverImage}
            onPress={() => handleViewImage(searchFriend?.coverImage)}
          />
          {/* <View style={{width: '100%', justifyContent: 'center'}}>
          </View> */}
          <Avatar
            title={commonFuc.getAcronym(searchFriend.name)}
            source={searchFriend.avatar ? {uri: searchFriend.avatar} : null}
            size={120}
            rounded
            overlayContainerStyle={{backgroundColor: '#d9dfeb'}}
            containerStyle={styles.avatar}
            onPress={() =>
              searchFriend.avatar && handleViewImage(searchFriend.avatar)
            }
          />
        </View>

        <View style={styles.action}>
          <Text style={styles.name}>{searchFriend.name}</Text>

          <View style={styles.buttonWrap}>
            {friendStatus === friendType.FOLLOWER && (
              <Button
                containerStyle={styles.buttonContainer}
                title="Từ chối"
                buttonStyle={styles.button}
                type="outline"
                onPress={handleDeleteFriendRequest}
              />
            )}
            <Button
              containerStyle={styles.buttonContainer}
              title={buttonTitle}
              buttonStyle={styles.button}
              onPress={handleOnPress}
              type={
                friendStatus === friendType.YOU_FOLLOW ? 'outline' : 'solid'
              }
            />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <ListItem topDivider>
            <Text style={styles.title}>Giới tính</Text>
            <Text style={styles.content}>
              {searchFriend.gender ? 'Nữ' : 'Nam'}
            </Text>
          </ListItem>
          <ListItem topDivider>
            <Text style={styles.title}>Ngày sinh</Text>
            <Text style={styles.content}>{handleDoB()}</Text>
          </ListItem>
          <ListItem topDivider>
            <Text style={styles.title}>Email</Text>
            <Text style={styles.content}>{handleEmail()}</Text>
          </ListItem>
          <ListItem topDivider>
            <Text style={styles.title}>Điện thoại</Text>
            <Text style={styles.content}>{handlePhoneNumber()}</Text>
          </ListItem>
          <ListItem containerStyle={{paddingTop: 0}}>
            <Text style={styles.title}></Text>
            <Text style={styles.content}>
              Số điện thoại chỉ hiển thị khi bạn có lưu số người này trong danh
              bạ
            </Text>
          </ListItem>
        </View>

        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>

        <Modal
          visible={isImageViewVisible}
          transparent={true}
          onRequestClose={handleCloseModal}>
          <ImageViewer
            imageUrls={imageView}
            onCancel={handleCloseModal}
            onSwipeDown={handleCloseModal}
            saveToLocalByLongPress={true}
            renderIndicator={() => (
              <View style={styles.indicator}>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Icon
                    name="arrowleft"
                    type="antdesign"
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>
                <Text style={{color: '#fff', fontSize: 18, marginLeft: 15}}>
                  {searchFriend.name}
                </Text>
              </View>
            )}
          />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    // alignItems: 'center',
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    // backgroundColor: 'cyan',
  },
  detailsContainer: {width: '100%'},
  title: {
    // backgroundColor: 'pink',
    // width: WINDOW_WIDTH / 4,
    width: '20%',
  },
  content: {
    color: 'grey',
    width: '80%',
    // width: (WINDOW_WIDTH * 3) / 4,
    // backgroundColor: 'cyan',
    paddingRight: 16,
  },
  coverImage: {
    width: '100%',
    height: WINDOW_HEIGHT * 0.28,
  },
  avatar: {
    marginTop: -80,
    transform: [{translateX: WINDOW_WIDTH / 2 - 60}],
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
  },
  indicator: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red',
  },
  buttonContainer: {
    margin: 10,
  },
  button: {borderRadius: 20, minWidth: WINDOW_WIDTH / 3},
});