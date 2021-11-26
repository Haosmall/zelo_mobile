import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, Image, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import test from '../assets/favicon1.png';
import OptionButton from '../components/conversation/OptionButton';
import ChangePasswordModal from '../components/modal/ChangePasswordModal';
import UpdateUserProfileModal from '../components/modal/UpdateUserProfileModal';
import ViewImageModal from '../components/modal/ViewImageModal';
import {DEFAULT_COVER_IMAGE, DEFAULT_IMAGE_MODAL} from '../constants';
import {fetchProfile} from '../redux/meSlice';
import globalStyles, {
  OVERLAY_AVATAR_COLOR,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../styles';
import commonFuc, {currentKey, logout, makeId} from '../utils/commonFuc';

export default function MeScreen() {
  const dispatch = useDispatch();

  const {userProfile} = useSelector(state => state.me);

  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
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

  const handleLogoutAll = () => {
    console.log('before all ', currentKey);
    makeId();
    console.log('after all ', currentKey);
  };

  const handleLogOut = () => {
    Alert.alert('Cảnh báo', 'Bạn có muốn đăng xuất không?', [
      {
        text: 'Không',
      },
      {
        text: 'Có',
        onPress: async () => {
          await logout(dispatch);
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
        <View style={{backgroundColor: '#fff'}}>
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
              overlayContainerStyle={{
                backgroundColor:
                  userProfile?.avatarColor || OVERLAY_AVATAR_COLOR,
              }}
              containerStyle={styles.avatar}
              onPress={() =>
                userProfile.avatar && handleViewImage(userProfile.avatar)
              }
            />
          </View>
          <View style={styles.action}>
            <Text style={styles.name}>{userProfile.name}</Text>
          </View>
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
          {handleEmail().length > 0 && (
            <ListItem topDivider>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.content}>{handleEmail()}</Text>
            </ListItem>
          )}
          {handlePhoneNumber().length > 0 && (
            <>
              <ListItem topDivider>
                <Text style={styles.title}>Điện thoại</Text>
                <Text style={styles.content}>{handlePhoneNumber()}</Text>
              </ListItem>
              <ListItem containerStyle={{paddingTop: 0}}>
                <Text style={styles.title}></Text>
                <Text style={styles.content}>
                  Số điện thoại của bạn chỉ hiển thị với bạn bè có lưu số của
                  bạn trong danh bạ
                </Text>
              </ListItem>
            </>
          )}
        </View>

        <ViewImageModal imageProps={imageProps} setImageProps={setImageProps} />

        <Pressable style={globalStyles.viewEle}>
          <OptionButton
            onPress={() => setIsUpdateProfile(true)}
            iconType="antdesign"
            iconName="edit"
            title="Đổi thông tin"
          />
          <OptionButton
            onPress={() => setIsChangePasswordVisible(true)}
            iconType="antdesign"
            iconName="lock"
            title="Đổi mật khẩu"
          />
          <OptionButton
            onPress={handleLogoutAll}
            iconType="material"
            iconName="logout"
            title="Đăng xuất ra khỏi các thiết bị khác"
          />
          <OptionButton
            onPress={handleLogOut}
            iconType="material"
            iconName="logout"
            title="Đăng xuất"
            iconColor="red"
            titleStyle={{color: 'red'}}
          />
        </Pressable>
      </ScrollView>

      {isUpdateProfile && (
        <UpdateUserProfileModal
          modalVisible={isUpdateProfile}
          setModalVisible={setIsUpdateProfile}
          userProfile={userProfile}
        />
      )}

      {isChangePasswordVisible && (
        <ChangePasswordModal
          modalVisible={isChangePasswordVisible}
          setModalVisible={setIsChangePasswordVisible}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2E9F1',
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
