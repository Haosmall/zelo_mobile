import React, {useEffect, useRef} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {meApi} from '../api';
import ContactAction from '../components/ContactAction';
import FriendItem from '../components/FriendItem';
import {friendType} from '../constants';
import {fetchFriendById, fetchFriends} from '../redux/friendSlice';
import {setLoading} from '../redux/globalSlice';
import globalStyles, {OVERLAY_AVATAR_COLOR} from '../styles';

export default function ContactScreen({navigation}) {
  const dispatch = useDispatch();

  const {listFriends} = useSelector(state => state.friend);
  const {socket, isLoading} = useSelector(state => state.global);

  const inputRef = useRef('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFriends());
  }, []);

  const handleSearchFriendChange = userName => {
    inputRef.current = userName;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleSearchFriendSubmit(userName);
    }, 300);
  };
  const handleSearchFriendSubmit = async userName => {
    // const response = await userApi.fetchUsers(userName);
    dispatch(fetchFriends({name: userName}));
  };

  const handleGoToPersonalScreen = async userId => {
    await dispatch(fetchFriendById({userId}));
    navigation.navigate('Chi tiết bạn bè');
  };

  const handleSyncContacts = async () => {
    dispatch(setLoading(true));
    const contacts = await handleGetContacts();
    const phones = handleContactPhoneNumber(contacts);
    // const phones = [
    //   {
    //     name: 'Nhật Hào',
    //     phone: '0373668360',
    //   },
    //   {
    //     name: 'Nhật',
    //     phone: '0987654321',
    //   },
    // ];
    console.log('cmh ', phones.length);
    if (phones.length > 0) {
      try {
        const response = await meApi.syncContacts(phones);
        console.log('Post Sync: ', response);
      } catch (error) {
        console.log('Post Sync error: ', error);
      }
    }
    dispatch(setLoading(false));
  };

  const handleGetContacts = async () => {
    let contacts = [];
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );

      if (permission === 'granted') {
        contacts = await Contacts.getAll();
        // console.log(contacts);
      }
    } catch (error) {
      console.log('Contacts: ', error);
    }

    return contacts;
  };

  const handleContactPhoneNumber = contacts => {
    if (!contacts) return [];
    const phonesTemp = contacts.map(contactEle => {
      const phone = contactEle.phoneNumbers[0].number
        .replaceAll(/\s/g, '')
        .replaceAll(/-/g, '')
        .replaceAll('+84', '0');
      const name = contactEle.displayName;

      return {name, phone};
    });

    const phones = phonesTemp.filter(phoneEle => phoneEle.phone.length === 10);

    return phones;
  };

  const validatePhone = phone => {
    if (!phone) return false;
    const regex = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    return regex.test(phone);
  };

  return (
    <SafeAreaView>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={globalStyles.spinnerTextStyle}
      />
      <ScrollView>
        {/* <ContactAction
          name="phone-square"
          type="font-awesome"
          title="Tìm kiếm bạn bè"
          backgroundColor="#70c43b"
          handlePress={() => navigation.navigate('Tìm kiếm bạn bè')}
        /> */}
        <ContactAction
          name="group"
          type="material"
          title="Lời mời kết bạn"
          backgroundColor="#00a4f4"
          handlePress={() => navigation.navigate('Lời mời kết bạn')}
        />
        <ContactAction
          name="phone-square"
          type="font-awesome"
          title="Đồng bộ danh bạ"
          backgroundColor="#70c43b"
          handlePress={handleSyncContacts}
        />
        <ContactAction
          name="search"
          type="ionicon"
          title="Tìm kiếm bạn bè"
          backgroundColor={OVERLAY_AVATAR_COLOR}
          handlePress={() => navigation.navigate('Lời mời kết bạn')}
        />
        {/* <ListItem>
          <Avatar
            rounded
            icon={{
              type: 'ionicon',
              name: 'search',
              color: GREY_COLOR,
            }}
            size="medium"
          />
          <Input
            ref={inputRef}
            renderErrorMessage={false}
            inputContainerStyle={{
              borderBottomWidth: 0,
              margin: 0,
            }}
            containerStyle={{
              width: WINDOW_WIDTH - 96,
              paddingHorizontal: 0,
            }}
            placeholder="Số điện thoại/email"
            onChangeText={value => handleSearchFriendChange(value)}
          />
        </ListItem> */}

        {listFriends &&
          listFriends.map(friend => {
            const {_id, avatar, name} = friend;
            return (
              <TouchableOpacity
                key={_id}
                onPress={() => handleGoToPersonalScreen(_id)}>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    name={name}
                    avatar={avatar}
                    type={friendType.FRIEND}
                    userId={_id}
                    navigation={navigation}
                  />
                  <View style={styles.bottomDivider}></View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  test: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
});
