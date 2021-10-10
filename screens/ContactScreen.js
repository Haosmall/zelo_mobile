import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Icon, Input, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import ContactAction from '../components/ContactAction';
import FriendItem from '../components/FriendItem';
import {friendType} from '../constants';
import {fetchFriends} from '../redux/friendSlice';
import {GREY_COLOR, WINDOW_WIDTH} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function ContactScreen({navigation}) {
  const dispatch = useDispatch();

  const {listFriends} = useSelector(state => state.friend);

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
          handlePress={() => navigation.navigate('Lời mời kết bạn')}
        />
        <ListItem>
          <Avatar
            rounded
            // overlayContainerStyle={{backgroundColor: 'blue'}}
            icon={{
              type: 'ionicon',
              name: 'search',
              color: GREY_COLOR,
            }}
            size="medium"
          />
          {/* <ListItem.Content
            style={{
              backgroundColor: 'cyan',
              // flexDirection: 'row',
              // alignContent: 'flex-start',
              // paddingHorizontal: 0,
              justifyContent: 'flex-start',
            }}></ListItem.Content> */}
          <Input
            ref={inputRef}
            // leftIcon={{
            //   type: 'ionicon',
            //   name: 'search',
            //   color: GREY_COLOR,
            // }}
            renderErrorMessage={false}
            inputContainerStyle={{
              borderBottomWidth: 0,
              // borderRadius: 50,
              // backgroundColor: 'cyan',
              margin: 0,
            }}
            containerStyle={{
              width: WINDOW_WIDTH - 96,
              paddingHorizontal: 0,
            }}
            placeholder="Số điện thoại/email"
            onChangeText={value => handleSearchFriendChange(value)}
          />
        </ListItem>

        {listFriends &&
          listFriends.map(friend => {
            const {_id, avatar, name} = friend;
            return (
              <Pressable key={_id}>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    name={name}
                    avatar={avatar}
                    type={friendType.FRIEND}
                    userId={_id}
                  />
                  <View style={styles.bottomDivider}></View>
                </View>
              </Pressable>
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
