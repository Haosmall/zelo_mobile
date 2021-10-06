import React, {useEffect} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import ContactAction from '../components/ContactAction';
import {fetchFriends} from '../redux/friendSlice';
import commonFuc from '../utils/commonFuc';

const {width} = Dimensions.get('window');

export default function ContactScreen({navigation}) {
  const dispatch = useDispatch();

  const {listFriends} = useSelector(state => state.friend);

  useEffect(() => {
    dispatch(fetchFriends({}));
  }, []);

  return (
    <SafeAreaView>
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
  test: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
});
