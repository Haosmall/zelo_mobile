import React, {useEffect, useRef, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {Avatar, Input, ListItem} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {friendApi} from '../api';
import {GREY_COLOR, OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function FriendSearchScreen() {
  const dispatch = useDispatch();

  const [listFriends, setListFriends] = useState([]);

  const inputRef = useRef('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // dispatch(fetchFriends({}));
  }, []);

  const handleSearchFriendChange = userName => {
    inputRef.current = userName;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (userName) {
        handleSearchFriendSubmit(userName);
      }
    }, 300);
  };
  const handleSearchFriendSubmit = async userName => {
    // const response = await userApi.fetchUsers(userName);
    const response = await friendApi.fetchFriends({name: userName});
    setListFriends(response);
    console.log(response);
  };

  return (
    <SafeAreaView>
      <ListItem>
        <Input
          ref={inputRef}
          leftIcon={{type: 'ionicon', name: 'search', color: GREY_COLOR}}
          renderErrorMessage={false}
          inputContainerStyle={{
            borderBottomWidth: 0,
            borderRadius: 50,
            // backgroundColor: 'red',
            paddingHorizontal: 15,
          }}
          placeholder="Số điện thoại/email"
          onChangeText={value => handleSearchFriendChange(value)}
        />
      </ListItem>

      <ScrollView>
        {listFriends.length > 0 &&
          listFriends.map(friend => {
            const {_id, avatar, name} = friend;
            return (
              <Pressable key={_id}>
                <View style={{backgroundColor: '#fff'}}>
                  <ListItem
                  // topDivider={false}
                  // bottomDivider={false}
                  >
                    <Avatar
                      rounded
                      title={commonFuc.getAcronym(name)}
                      overlayContainerStyle={styles.overlay}
                      source={{
                        uri: avatar,
                      }}
                      size="medium"
                    />
                    <ListItem.Content>
                      <ListItem.Title>{name}</ListItem.Title>
                      {/* <ListItem.Subtitle
                        numberOfLines={
                          1
                        }>{`${senderName}${content}`}</ListItem.Subtitle> */}
                    </ListItem.Content>
                    {/* <MessageInfo
                      createdAt={createdAt}
                      numberUnread={numberUnread}
                    /> */}
                  </ListItem>
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
  badgeElement: {color: 'white', fontSize: 10},
  iconBadge: {
    color: 'white',
    fontSize: 10,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
    marginTop: -26,
    marginLeft: 14,
  },
  overlay: {
    backgroundColor: OVERLAY_AVATAR_COLOR,
  },
});
