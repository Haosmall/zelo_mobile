// import {LinearGradient} from 'expo-linear-gradient';
// import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Conversation from '../components/Conversation';
import MessageHeaderModal from '../components/MessageHeaderModal';
import {
  deleteFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  fetchMyFriendRequests,
  inviteFriendRequest,
} from '../redux/friendSlice';
import {setCurrentUserId, setKeyboardHeight} from '../redux/globalSlice';
import {
  addMessage,
  addReaction,
  deleteMessage,
  fetchConversations,
  fetchListLastViewer,
  renameConversation,
  setListLastViewer,
  setNotification,
  updateCurrentConversation,
  updateVoteMessage,
  usersNotTyping,
  usersTyping,
} from '../redux/messageSlice';

const generateArray = length =>
  Array.from(Array(length), (_, index) => index + 1);

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();

  const {conversations} = useSelector(state => state.message);
  const {socket, currentUserId} = useSelector(state => state.global);
  const {userProfile} = useSelector(state => state.me);

  const handleFetchConversations = async () => {
    await dispatch(fetchConversations());
    console.log('fect');
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
      console.log('Lang Nghe', conversationId);
      dispatch(addMessage({conversationId, message}));
      dispatch(
        setNotification({conversationId, message, userId: currentUserId}),
      );
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

    socket.on(
      'create-individual-conversation-when-was-friend',
      conversationId => {
        console.log('create-individual-conversation-when-was-friend');
        dispatch(fetchConversations());
      },
    );

    socket.on('send-friend-invite', details => {
      console.log('send-friend-invite');
      dispatch(inviteFriendRequest(details));
    });

    socket.on('update-vote-message', (conversationId, message) => {
      console.log('update-vote-message');
      dispatch(updateVoteMessage({conversationId, message}));
    });

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

    socket.on('typing', (conversationId, user) => {
      dispatch(usersTyping({conversationId, user}));
    });

    socket.on('not-typing', (conversationId, user) => {
      dispatch(usersNotTyping({conversationId, user}));
    });

    socket.on('create-individual-conversation', conversationId => {
      handleEnterChat(conversationId);
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
