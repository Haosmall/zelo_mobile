import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import AddVoteModal from '../components/AddVoteModal';
import ConversationOptionsBar from '../components/ConversationOptionsBar';
import RenameConversationModal from '../components/RenameConversationModal';
import {
  DEFAULT_ADD_VOTE_MODAL,
  DEFAULT_RENAME_CONVERSATION_MODAL,
  messageType,
} from '../constants';
import {useGoback} from '../hooks';
import {fetchFiles} from '../redux/messageSlice';
import globalStyles, {OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function ConversationOptionsScreen({navigation, route}) {
  const {conversationId} = route.params;

  const {currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );
  const dispatch = useDispatch();
  const {totalMembers, name, type, avatar, isNotify} = currentConversation;

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

  // const handleGoBack = () => {
  //   navigation.goBack();
  //   return true;
  // };

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleGoBack);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
  //   };
  // }, []);
  const AVATAR =
    'https://wiki.tino.org/wp-content/uploads/2020/10/react-native-final-file.jpg';
  const avatarSource =
    typeof avatar === 'string' && avatar
      ? {
          uri: avatar,
        }
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Pressable style={styles.subContainer}>
          <Avatar
            rounded
            size="large"
            source={avatarSource}
            overlayContainerStyle={styles.overlay}
            title={type ? null : commonFuc.getAcronym(name)}
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
            {name}
          </Text>
          <ConversationOptionsBar
            name={name}
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

        <Pressable style={globalStyles.viewEle}>
          <TouchableOpacity onPress={handleGoToFileScreen}>
            <ListItem
            // topDivider={false}
            // bottomDivider={false}
            >
              <Icon type="antdesign" name="folderopen" />
              <ListItem.Content>
                <ListItem.Title
                // style={{
                //   width: '100%',
                //   fontWeight: numberUnread > 0 ? 'bold' : 'normal',
                // }}
                >
                  Ảnh, video, file đã gửi
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              backgroundColor: '#E5E6E8',
              height: 1,
              marginLeft: 55,
            }}></View>
        </Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
        <Pressable style={globalStyles.viewEle}></Pressable>
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
