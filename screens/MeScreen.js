import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, Image, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import test from '../assets/favicon1.png';
import ViewImageModal from '../components/ViewImageModal';
import {DEFAULT_COVER_IMAGE, DEFAULT_IMAGE_MODAL} from '../constants';
import {resetFriendSlice} from '../redux/friendSlice';
import {resetGlobalSlice, setLogin} from '../redux/globalSlice';
import {fetchProfile, resetMeSlice} from '../redux/meSlice';
import {resetMessageSlice} from '../redux/messageSlice';
import {resetPinSlice} from '../redux/pinSlice';
import {OVERLAY_AVATAR_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import commonFuc from '../utils/commonFuc';
import RNRestart from 'react-native-restart';
import UpdateUserProfileModal from '../components/UpdateUserProfileModal';

export default function MeScreen() {
  const dispatch = useDispatch();

  const {userProfile} = useSelector(state => state.me);

  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [imageIndex, setiImageIndex] = useState(0);
  const [imageProps, setImageProps] = useState(DEFAULT_IMAGE_MODAL);

  const handleFetchProfile = async () => {
    await dispatch(fetchProfile());
  };

  useEffect(() => {
    handleFetchProfile();
    console.log({userProfile});
  }, []);

  const images = [
    {
      source: {
        uri: userProfile?.avatar || `${test}`,
      },
    },
  ];

  const handleLogOut = () => {
    Alert.alert('Cảnh báo', 'Bạn có muốn đăng xuất không?', [
      {
        text: 'Không',
      },
      {
        text: 'Có',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('userId');
          dispatch(resetFriendSlice());
          dispatch(resetGlobalSlice());
          dispatch(resetMeSlice());
          dispatch(resetMessageSlice());
          dispatch(resetPinSlice());
          // dispatch(setLogin(false));
          RNRestart.Restart();
        },
      },
    ]);
  };

  const handleViewImage = url => {
    setImageProps({
      isVisible: true,
      userName: userProfile.name,
      content: [{url: url || DEFAULT_COVER_IMAGE}],
      isImage: true,
    });
  };

  const handleDoB = () => {
    let dob = '';

    if (userProfile.dateOfBirth) {
      const day = ('00' + userProfile.dateOfBirth.day).slice(-2);
      const month = ('00' + userProfile.dateOfBirth.month).slice(-2);
      const year = userProfile.dateOfBirth.year;
      dob = `${day}/${month}/${year}`;
    }
    return dob;
  };

  const handleEmail = () => {
    const username = userProfile.username;
    let email = '';
    if (username) {
      if (username.includes('@')) {
        email = username;
      }
    }
    return email;
  };

  const handlePhoneNumber = () => {
    const username = userProfile.username;
    let phoneNumber = '';
    if (username) {
      if (!username.includes('@')) {
        phoneNumber = username;
      }
    }
    return phoneNumber;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{uri: userProfile?.coverImage || DEFAULT_COVER_IMAGE}}
            style={styles.coverImage}
            onPress={() => handleViewImage(userProfile?.coverImage)}
          />
          {/* <View style={{width: '100%', justifyContent: 'center'}}>
          </View> */}
          <Avatar
            title={commonFuc.getAcronym(userProfile.name)}
            source={userProfile.avatar ? {uri: userProfile.avatar} : null}
            size={120}
            rounded
            overlayContainerStyle={{backgroundColor: OVERLAY_AVATAR_COLOR}}
            containerStyle={styles.avatar}
            onPress={() =>
              userProfile.avatar && handleViewImage(userProfile.avatar)
            }
          />
        </View>
        <View style={styles.action}>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Button
            title="Đổi thông tin"
            type="clear"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            onPress={() => setIsUpdateProfile(true)}
          />
        </View>
        <View style={styles.detailsContainer}>
          <ListItem topDivider>
            <Text style={styles.title}>Giới tính</Text>
            <Text style={styles.content}>
              {userProfile.gender ? 'Nữ' : 'Nam'}
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

        <ViewImageModal imageProps={imageProps} setImageProps={setImageProps} />

        <Button
          title="Đăng xuất"
          onPress={handleLogOut}
          containerStyle={[styles.buttonContainer, {marginHorizontal: 15}]}
          buttonStyle={styles.button}
        />
      </ScrollView>

      {isUpdateProfile && (
        <UpdateUserProfileModal
          modalVisible={isUpdateProfile}
          setModalVisible={setIsUpdateProfile}
          userProfile={userProfile}
        />
      )}
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
    borderRadius: 50,
  },
  button: {
    borderRadius: 50,
  },
});
