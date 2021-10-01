import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Button} from 'react-native-elements';
import {
  BackHandler,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import ChatMessage from '../components/ChatMessage';
import ImagePickerModal from '../components/ImagePickerModal';
import MessageBottomBar from '../components/MessageBottomBar';
import MessageDivider from '../components/MessageDivider';
import MessageHeaderLeft from '../components/MessageHeaderLeft';
import MessageModal from '../components/MessageModal';
import ReactionModal from '../components/ReactionModal';
import StickyBoard from '../components/StickyBoard';
import {
  DEFAULT_MESSAGE_MODAL_VISIBLE,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_REACTION_MODAL_VISIBLE,
} from '../constants';
import {setLoading} from '../redux/globalSlice';
import {
  clearMessagePages,
  fetchMessages,
  updateCurrentConversation,
} from '../redux/messageSlice';
import LinearGradient from 'react-native-linear-gradient';

const page = DEFAULT_PAGE;
const size = DEFAULT_PAGE_SIZE;

export default function MessageScreen({navigation, route}) {
  const {conversationId} = route.params;
  const dispatch = useDispatch();
  const {messages, messagePages, currentConversation} = useSelector(
    state => state.message,
  );
  const {currentUserId, isLoading, keyboardHeight} = useSelector(
    state => state.global,
  );
  const {totalPages} = messagePages;
  const {totalMembers, name, type, avatar} = currentConversation;

  const [modalVisible, setModalVisible] = useState(
    DEFAULT_MESSAGE_MODAL_VISIBLE,
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [reactProps, setReactProps] = useState(DEFAULT_REACTION_MODAL_VISIBLE);

  const [stickyBoardVisible, setStickyBoardVisible] = useState(false);
  const [apiParams, setApiParams] = useState({page, size});
  const scrollViewRef = useRef(null);
  const positionRef = useRef(0);

  const handleGoBack = () => {
    dispatch(clearMessagePages());
    navigation.goBack();
    return true;
  };
  const handleGoToOptionScreen = () => {
    navigation.navigate('Tùy chọn', {
      conversationId,
    });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleGoBack);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    };
  }, []);

  const headerRight = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
      }}>
      <TouchableOpacity onPress={handleGoToOptionScreen}>
        <Icon name="bars" type="antdesign" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  const headerLeft = () => (
    <MessageHeaderLeft
      goBack={handleGoBack}
      totalMembers={totalMembers}
      name={name}
    />
  );

  useLayoutEffect(() => {
    console.log('Message: ', currentUserId);
    dispatch(fetchMessages({conversationId, apiParams}));

    navigation.setOptions({
      title: '',
      headerLeft,
      headerRight,
    });
  }, [navigation]);

  const renderMessage = (currentMessage, index) => {
    const isMyMessage = currentUserId === currentMessage.user._id;
    const nextMessage = messages?.[index + 1];

    const nextMessageTime = new Date(nextMessage?.createdAt);
    const messageTime = new Date(currentMessage.createdAt);
    const messageTimeTemp = new Date(currentMessage.createdAt);

    const isSeparate =
      messageTimeTemp.setMinutes(messageTimeTemp.getMinutes() - 5) >
      nextMessageTime;

    return (
      <TouchableWithoutFeedback>
        <View>
          {isSeparate && <MessageDivider dateString={messageTime} />}
          <ChatMessage
            message={currentMessage}
            isMyMessage={isMyMessage}
            setModalVisible={setModalVisible}
            showReactDetails={setReactProps}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const goToNextPage = async () => {
    console.log('Scroll Top');
    const currentPage = apiParams.page;
    if (currentPage < totalPages) {
      dispatch(setLoading(true));
      const item = messages[0];
      const nextPage = currentPage + 1;
      const newParam = {...apiParams, page: nextPage};
      await dispatch(fetchMessages({conversationId, apiParams: newParam}));

      dispatch(setLoading(false));
      setApiParams(newParam);
      console.log({currentPage, totalPages});
    }
  };
  // const onContentOffsetChanged = (distanceFromTop) => {
  // 	distanceFromTop === 0 && goToNextPage();
  // };

  const onContentOffsetChanged = distanceFromTop => {
    positionRef.current = distanceFromTop;
    // console.log({ distanceFromTop });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        console.log('asda');
        setStickyBoardVisible(false);
      }}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' && 'padding'}
          style={styles.container}
          keyboardVerticalOffset={90}>
          <>
            {messages.length > 0 ? (
              <FlatList
                onScroll={event =>
                  onContentOffsetChanged(event.nativeEvent.contentOffset.y)
                }
                // ref={scrollViewRef}
                // onLayout={() =>
                // 	scrollViewRef.current.scrollToEnd({ animated: true })
                // }
                onEndReached={() => {
                  goToNextPage();
                }}
                data={messages}
                keyExtractor={item => item._id}
                renderItem={({item, index}) => renderMessage(item, index)}
                initialNumToRender={20}
                ListFooterComponent={() =>
                  isLoading ? <MessageDivider isLoading={true} /> : null
                }
                // stickyHeaderIndices={[0]}
                inverted
                contentContainerStyle={{paddingBottom: 15}}
              />
            ) : (
              <ScrollView></ScrollView>
            )}
            <MessageBottomBar
              conversationId={conversationId}
              showStickyBoard={setStickyBoardVisible}
              showImageModal={setImageModalVisible}
            />

            <StickyBoard
              height={keyboardHeight}
              visible={stickyBoardVisible}
              setVisible={setStickyBoardVisible}
            />
          </>
          <ReactionModal
            reactProps={reactProps}
            setReactProps={setReactProps}
          />
          <ImagePickerModal
            modalVisible={imageModalVisible}
            setModalVisible={setImageModalVisible}
          />
          <MessageModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E2E9F1'},
  headerTitle: {
    color: '#fff',
    fontSize: 20,
  },
  headerSubTitle: {
    color: '#fff',
    fontSize: 12,
  },
});
