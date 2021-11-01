import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Clipboard,
} from 'react-native';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi} from '../api';
import AddVoteModal from '../components/AddVoteModal';
import ConversationOptionsBar from '../components/ConversationOptionsBar';
import ListChannel from '../components/ListChannel';
import OptionButton from '../components/OptionButton';
import RenameConversationModal from '../components/RenameConversationModal';
import {
  DEFAULT_ADD_VOTE_MODAL,
  DEFAULT_RENAME_CONVERSATION_MODAL,
  ERROR_MESSAGE,
  messageType,
  LEAVE_GROUP_MESSAGE,
  DELETE_GROUP_MESSAGE,
} from '../constants';
import {useGoback} from '../hooks';
import {fetchFiles, fetchMembers} from '../redux/messageSlice';
import globalStyles, {OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function ConversationOptionsScreen({navigation, route}) {
  const {conversationId} = route.params;

  const {currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );

  const {userProfile} = useSelector(state => state.me);
  const {socket} = useSelector(state => state.global);
  const dispatch = useDispatch();
  const {type, avatar, isNotify} = currentConversation;

  const [modalVisible, setModalVisible] = useState(
    DEFAULT_RENAME_CONVERSATION_MODAL,
  );
  const [addVoteVisible, setAddVoteVisible] = useState(DEFAULT_ADD_VOTE_MODAL);

  useGoback(navigation);

  useEffect(() => {}, []);

  const handleGoToFileScreen = async () => {
    await dispatch(
      fetchFiles({
        conversationId: currentConversationId,
        type: messageType.ALL,
      }),
    );
    navigation.navigate('Ảnh, video, file đã gửi');
  };

  const AVATAR =
    'https://wiki.tino.org/wp-content/uploads/2020/10/react-native-final-file.jpg';
  const avatarSource =
    typeof avatar === 'string' && avatar
      ? {
          uri: avatar,
        }
      : null;

  const isLeader = () => {
    if (currentConversation?.leaderId) {
      return currentConversation.leaderId === userProfile._id;
    }
    return false;
  };

  const handleDeleteOnPress = () => {
    Alert.alert(
      'Cảnh báo',
      isLeader() ? DELETE_GROUP_MESSAGE : LEAVE_GROUP_MESSAGE,
      [
        {
          text: 'Không',
        },
        {
          text: 'Có',
          onPress: () => {
            if (isLeader()) {
              handleDeleteConversation();
            } else {
              handleLeaveConversation();
            }
          },
        },
      ],
    );
  };

  const handleDeleteConversation = async () => {
    console.log('giai tan');
    try {
      const response = await conversationApi.deleteGroup(currentConversationId);
      navigation.popToTop();
    } catch (error) {
      console.error('Delete group: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleLeaveConversation = async () => {
    console.log('Roi nhom');
    try {
      const response = await conversationApi.leaveGroup(currentConversationId);
      socket.emit('leave-conversation', currentConversationId);
      navigation.popToTop();
    } catch (error) {
      console.error('Leave conversation: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleCopyLink = async () => {
    Clipboard.setString(
      `https://zelochat.xyz/jf-link/${currentConversationId}`,
    );
    commonFuc.notifyMessage('Đã sao chép');
  };

  const handleGoToMemberScreen = () => {
    dispatch(fetchMembers({conversationId: currentConversationId}));
    navigation.navigate('Thành viên');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Pressable style={styles.subContainer}>
          <Avatar
            rounded
            size="large"
            source={avatarSource}
            overlayContainerStyle={styles.overlay}
            title={type ? null : commonFuc.getAcronym(currentConversation.name)}
            icon={{
              name: 'groups',
              type: 'material',
              size: 55,
              color: '#f1f2f7',
            }}>
            {type && (
              <Avatar.Accessory
                size={15}
                type="feather"
                name="camera"
                color="transparent"
                iconStyle={{color: 'black'}}
                containerStyle={styles.avatarAccessory}
              />
            )}
          </Avatar>

          <Text style={{fontWeight: '600', fontSize: 16, marginVertical: 8}}>
            {currentConversation.name}
          </Text>
          <ConversationOptionsBar
            name={currentConversation.name}
            type={type}
            notify={isNotify}
            setModalVisible={setModalVisible}
            openAddVoteModal={setAddVoteVisible}
            navigation={navigation}
          />
        </Pressable>
        {/* <Text>{conversationId}</Text>
        <Text>{totalMembers}</Text>
        <Text>{name}</Text>
        <Text>{type.toString()}</Text> */}

        {type && (
          <Pressable style={globalStyles.viewEle}>
            <ListChannel />
          </Pressable>
        )}

        <Pressable style={globalStyles.viewEle}>
          <OptionButton
            onPress={handleGoToFileScreen}
            iconType="antdesign"
            iconName="folderopen"
            title="Ảnh, video, file đã gửi"
          />

          {type && (
            <>
              <OptionButton
                onPress={handleCopyLink}
                iconType="feather"
                iconName="link"
                title="Link tham gia nhóm"
                subtitle={`https://zelochat.xyz/jf-link/${currentConversationId}`}
              />
              <OptionButton
                // onPress={handleGoToFileScreen}
                iconType="feather"
                iconName="users"
                title={`Xem thành viên (${currentConversation.totalMembers})`}
                onPress={handleGoToMemberScreen}
              />
            </>
          )}
        </Pressable>

        {type && (
          <Pressable style={globalStyles.viewEle}>
            <OptionButton
              onPress={handleDeleteOnPress}
              iconType="material"
              iconName="logout"
              iconColor="red"
              title={isLeader() ? 'Giải tán nhóm' : 'Rời nhóm'}
              titleStyle={{
                color: 'red',
              }}
            />
          </Pressable>
        )}
        <Pressable style={[globalStyles.viewEle, {height: 500}]}></Pressable>
      </ScrollView>
      <AddVoteModal
        modalVisible={addVoteVisible}
        setModalVisible={setAddVoteVisible}
      />
      <RenameConversationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E2E9F1'},
  subContainer: {backgroundColor: '#FFF', alignItems: 'center', padding: 12},

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overlay: {
    backgroundColor: OVERLAY_AVATAR_COLOR,
  },
  avatarAccessory: {
    justifyContent: 'center',
    backgroundColor: '#f3f4f8',
    width: 25,
    height: 25,
    borderRadius: 50,
  },
});
