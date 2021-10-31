// import {LinearGradient} from 'expo-linear-gradient';
// import {StatusBar} from 'expo-status-bar';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import Conversation from '../components/Conversation';
import MessageHeaderModal from '../components/MessageHeaderModal';
import {REACT_APP_SOCKET_URL} from '../constants';
import {
  cancelMyFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  fetchFriendById,
  fetchFriendRequests,
  fetchFriends,
  fetchMyFriendRequests,
  inviteFriendRequest,
} from '../redux/friendSlice';
import {fetchStickers, initSocket} from '../redux/globalSlice';
import {
  addMessage,
  addReaction,
  deleteMessage,
  fetchConversations,
  fetchListLastViewer,
  renameConversation,
  setNotification,
  updateCurrentConversation,
  updateVoteMessage,
  usersNotTyping,
  usersTyping,
} from '../redux/messageSlice';
import globalStyles from '../styles';

const generateArray = length =>
  Array.from(Array(length), (_, index) => index + 1);
let socket = io(REACT_APP_SOCKET_URL, {transports: ['websocket']});
export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const {conversations} = useSelector(state => state.message);
  const {currentUserId} = useSelector(state => state.global);
  const {userProfile} = useSelector(state => state.me);

  const handleFetchConversations = async () => {
    await dispatch(fetchConversations());
    await dispatch(fetchStickers());
    console.log('fect');
    dispatch(fetchFriendRequests());
    dispatch(fetchMyFriendRequests());
    dispatch(initSocket(socket));
  };

  useEffect(() => {
    if (!conversations) return;

    const conversationIds = conversations.map(
      conversationEle => conversationEle._id,
    );

    socket.emit('join-conversations', conversationIds);
    socket.emit('join', currentUserId);
    console.log('thay doi');
  }, [conversations]);

  useEffect(() => {
    handleFetchConversations();
  }, []);

  useEffect(() => {
    // TODO:<====================== conversation socket ======================>
    socket.on(
      'create-individual-conversation-when-was-friend',
      conversationId => {
        console.log('create-individual-conversation-when-was-friend');
        dispatch(fetchConversations());
      },
    );

    socket.on('create-individual-conversation', conversationId => {
      // handleEnterChat(conversationId);
      dispatch(fetchConversations());
    });

    // TODO:<====================== message socket ======================>
    socket.on('new-message', (conversationId, message) => {
      console.log('new-message', conversationId);
      dispatch(addMessage({conversationId, message}));
      dispatch(
        setNotification({conversationId, message, userId: currentUserId}),
      );
    });

    socket.on('delete-message', ({conversationId, channelId, id}) => {
      console.log('delete-message');
      console.log({conversationId, channelId, id});
      dispatch(deleteMessage({conversationId, channelId, id}));
    });

    // TODO:<====================== vote socket ======================>
    socket.on('update-vote-message', (conversationId, message) => {
      console.log('update-vote-message');
      dispatch(updateVoteMessage({conversationId, message}));
    });

    // TODO:<====================== reaction socket ======================>
    socket.on(
      'add-reaction',
      ({conversationId, channelId, messageId, user, type}) => {
        console.log('Add reaction: ');
        dispatch(
          addReaction({conversationId, channelId, messageId, user, type}),
        );
      },
    );

    // TODO:<====================== typing socket ======================>
    socket.on('typing', (conversationId, user) => {
      dispatch(usersTyping({conversationId, user}));
    });

    socket.on('not-typing', (conversationId, user) => {
      dispatch(usersNotTyping({conversationId, user}));
    });

    // TODO:<====================== lastview socket ======================>
    socket.on('user-last-view', ({conversationId, userId, lastView}) => {
      console.log('user-last-view', {conversationId, userId, lastView});
      currentUserId !== userId &&
        dispatch(fetchListLastViewer({conversationId}));
      // userProfile._id !== userId &&
      //   dispatch(
      //     setListLastViewer({
      //       conversationId,
      //       userId,
      //       lastView,
      //     }),
      //   );
    });

    // TODO:<====================== friend socket ======================>
    socket.on(
      'rename-conversation',
      (conversationId, conversationName, message) => {
        console.log('Rename conversation');
        dispatch(
          renameConversation({conversationId, conversationName, message}),
        );
      },
    );

    socket.on('deleted-friend', userId => {
      console.log('deleted-friend');
      dispatch(deleteFriend(userId));
    });

    socket.on('accept-friend', details => {
      console.log('accept-friend');
      dispatch(cancelMyFriendRequest({userId: details._id, type: true}));
      dispatch(fetchFriends());
      dispatch(fetchFriendById({userId: details._id}));
    });

    socket.on('deleted-invite-was-send', userId => {
      console.log('deleted-invite-was-send');
      dispatch(deleteFriendRequest(userId));
      dispatch(fetchFriends());
      dispatch(fetchFriendById({userId}));
    });

    socket.on('deleted-friend-invite', userId => {
      console.log('deleted-friend-invite');
      dispatch(cancelMyFriendRequest({userId, type: false}));
      dispatch(fetchFriends());
      dispatch(fetchFriendById({userId}));
    });

    socket.on('send-friend-invite', details => {
      console.log('send-friend-invite');
      dispatch(inviteFriendRequest(details));
      dispatch(fetchFriendById({userId: details._id}));
    });
  }, []);

  const handleEnterChat = (
    conversationId,
    name,
    totalMembers,
    type,
    avatar,
  ) => {
    // dispatch(clearMessagePages());
    dispatch(updateCurrentConversation({conversationId}));
    dispatch(fetchListLastViewer({conversationId}));
    console.log('conver: ', conversationId);
    navigation.navigate('Nhắn tin', {
      conversationId,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchConversations());
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView>
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={conversation => conversation._id}
          initialNumToRender={12}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => {
            console.log(item);
            return (
              <Pressable key={item?._id}>
                <Conversation
                  name={item?.name}
                  avatars={item?.avatar}
                  numberUnread={item?.numberUnread}
                  lastMessage={item?.lastMessage}
                  handleEnterChat={handleEnterChat}
                  type={item?.type}
                  conversationId={item?._id}
                  totalMembers={item?.totalMembers}
                />
              </Pressable>
            );
          }}
        />
      ) : (
        <ScrollView>
          <View style={globalStyles.emty}>
            <Icon name="warning" type="antdesign" />
            <Text style={globalStyles.emptyText}>Không có tin nhắn nào</Text>
          </View>
        </ScrollView>
      )}

      {/* <Image
          source={{
            uri: 'https://i.pinimg.com/originals/86/b3/31/86b3315f71d8e1177f32d8007aa49ceb.gif',
          }}
          style={[globalStyles.imageMessage, {width: 300, height: 200}]}
        />
        <Image
          source={{uri: 'http://www.clicktorelease.com/code/gif/1.gif'}}
          style={{width: 100, height: 100}}
        /> */}

      <MessageHeaderModal navigation={navigation} />
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
