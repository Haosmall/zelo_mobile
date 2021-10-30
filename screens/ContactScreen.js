import React, {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ContactAction from '../components/ContactAction';
import FriendItem from '../components/FriendItem';
import {friendType} from '../constants';
import {fetchFriendById, fetchFriends} from '../redux/friendSlice';
import {fetchSyncContacts} from '../redux/meSlice';
import {OVERLAY_AVATAR_COLOR} from '../styles';

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

  const handleGoToPhoneBookScreen = async userId => {
    await dispatch(fetchSyncContacts());
    navigation.navigate('Bạn từ danh bạ máy');
  };

  return (
    <SafeAreaView>
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
          title="Bạn từ danh bạ máy"
          backgroundColor="#70c43b"
          handlePress={handleGoToPhoneBookScreen}
          // handlePress={handleSyncContacts}
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
