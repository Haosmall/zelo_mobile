// import {LinearGradient} from 'expo-linear-gradient';
// import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import io from 'socket.io-client';
import Conversation from '../components/Conversation';
import MessageHeaderModal from '../components/MessageHeaderModal';
import {REACT_APP_SOCKET_URL} from '../constants';
import {
  deleteFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  fetchMyFriendRequests,
  inviteFriendRequest,
} from '../redux/friendSlice';
import {
  initSocket,
  setCurrentUserId,
  setKeyboardHeight,
} from '../redux/globalSlice';
import {
  addMessage,
  addReaction,
  deleteMessage,
  fetchConversations,
  renameConversation,
  updateCurrentConversation,
} from '../redux/messageSlice';

let socket = io(REACT_APP_SOCKET_URL, {transports: ['websocket']});

const generateArray = length =>
  Array.from(Array(length), (_, index) => index + 1);

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  dispatch(initSocket({socket}));

  const {conversations} = useSelector(state => state.message);

  const handleFetchConversations = async () => {
    dispatch(fetchConversations());
    const currentUserId = await AsyncStorage.getItem('userId');
    dispatch(setCurrentUserId(currentUserId));
    console.log('fect');
    const keyboardHeightStr = await AsyncStorage.getItem('keyboardHeight');
    dispatch(setKeyboardHeight(keyboardHeightStr));
    dispatch(fetchFriendRequests());
    dispatch(fetchMyFriendRequests());
  };

  useEffect(() => {
    if (!conversations) return;

    const conversationIds = conversations.map(
      conversationEle => conversationEle._id,
    );

    socket.emit('join-conversations', conversationIds);
    console.log('thay doi');
  }, [conversations]);

  useEffect(() => {
    handleFetchConversations();
  }, []);

  useEffect(() => {
    socket.on('new-message', (conversationId, message) => {
      console.log('Lang Nghe');
      dispatch(addMessage({conversationId, message}));
    });

    socket.on('delete-message', (conversationId, id) => {
      console.log('Thu hoi');
      console.log({conversationId, id});
      dispatch(deleteMessage({conversationId, id}));
    });

    socket.on('add-reaction', (conversationId, messageId, user, type) => {
      console.log('Add reaction');
      dispatch(addReaction({conversationId, messageId, user, type}));
    });

    socket.on(
      'rename-conversation',
      (conversationId, conversationName, message) => {
        console.log('Rename conversation');
        dispatch(
          renameConversation({conversationId, conversationName, message}),
        );
      },
    );
    socket.on('accept-friend', details => {
      console.log('accept-friend');
      dispatch(deleteFriendRequest(details._id));
      dispatch(fetchFriends());
    });

    socket.on('send-friend-invite', details => {
      console.log('send-friend-invite');
      dispatch(inviteFriendRequest(details));
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
    console.log('conver: ', conversationId);
    navigation.navigate('Nhắn tin', {
      conversationId,
    });
  };
  return (
    <SafeAreaView>
      <ScrollView>
        {conversations &&
          conversations.map(conversation => {
            const {
              _id,
              avatar,
              numberUnread,
              lastMessage,
              name,
              type,
              totalMembers,
            } = conversation;
            return (
              <Pressable key={_id}>
                <Conversation
                  name={name}
                  avatars={avatar}
                  numberUnread={numberUnread}
                  lastMessage={lastMessage}
                  handleEnterChat={handleEnterChat}
                  type={type}
                  conversationId={_id}
                  totalMembers={totalMembers}
                />
              </Pressable>
            );
          })}

        <MessageHeaderModal navigation={navigation} />
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
