import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';
import AddVoteModal from '../components/AddVoteModal';
import ConversationOptionsBar from '../components/ConversationOptionsBar';
import RenameConversationModal from '../components/RenameConversationModal';
import {
  DEFAULT_ADD_VOTE_MODAL,
  DEFAULT_RENAME_CONVERSATION_MODAL,
} from '../constants';
import {useGoback} from '../hooks';

export default function ConversationOptionsScreen({navigation, route}) {
  const {conversationId} = route.params;

  const {currentConversation} = useSelector(state => state.message);
  const {totalMembers, name, type, avatar} = currentConversation;

  const [modalVisible, setModalVisible] = useState(
    DEFAULT_RENAME_CONVERSATION_MODAL,
  );
  const [addVoteVisible, setAddVoteVisible] = useState(DEFAULT_ADD_VOTE_MODAL);

  useGoback(navigation);

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
    typeof avatar === 'string'
      ? {
          uri: avatar,
        }
      : null;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.subContainer}>
          <Avatar
            rounded
            size="large"
            source={avatarSource}
            overlayContainerStyle={styles.overlay}
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
            setModalVisible={setModalVisible}
            openAddVoteModal={setAddVoteVisible}
          />
        </View>
        <Text>{conversationId}</Text>
        <Text>{totalMembers}</Text>
        <Text>{name}</Text>
        <Text>{type.toString()}</Text>
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
    backgroundColor: '#d9dfeb',
  },
  avatarAccessory: {
    justifyContent: 'center',
    backgroundColor: '#f3f4f8',
    width: 25,
    height: 25,
    borderRadius: 50,
  },
});
