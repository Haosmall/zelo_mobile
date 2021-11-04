import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {Avatar, Button, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi} from '../api';
import EmptyData from '../components/EmptyData';
import {ERROR_MESSAGE} from '../constants';
import {fetchMembers} from '../redux/messageSlice';
import {MAIN_COLOR, OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

const MemberScreen = ({navigation}) => {
  const {members, currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );
  const {userProfile} = useSelector(state => state.me);
  const dispatch = useDispatch();
  const handleDeleteMember = (memberId, memberName) => {
    try {
      Alert.alert(
        'Cảnh báo',
        `Bạn có muốn xóa ${memberName} ra khỏi nhóm không?`,
        [
          {
            text: 'Không',
          },
          {
            text: 'Có',
            onPress: async () => {
              const response = await conversationApi.deleteMember(
                currentConversationId,
                memberId,
              );
              dispatch(fetchMembers({conversationId: currentConversationId}));
              commonFuc.notifyMessage('Xóa thành công');
            },
          },
        ],
      );
    } catch (error) {
      console.error('Delete Member: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          color: MAIN_COLOR,
          fontWeight: 'bold',
          fontSize: 16,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
        Thành viên ({members.length})
      </Text>
      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={item => item._id}
          initialNumToRender={12}
          renderItem={({item}) => (
            <Pressable
            // onPress={
            //   item.isExists ? () => handleGoToPersonalScreen(item._id) : null
            // }
            >
              <View style={{backgroundColor: '#fff'}}>
                <ListItem topDivider={false}>
                  <Avatar
                    rounded
                    title={commonFuc.getAcronym(item.name)}
                    overlayContainerStyle={{
                      backgroundColor: OVERLAY_AVATAR_COLOR,
                    }}
                    source={
                      item?.avatar?.length > 0
                        ? {
                            uri: item?.avatar,
                          }
                        : null
                    }
                    size="medium"
                  />
                  <ListItem.Content>
                    <ListItem.Title numberOfLines={1}>
                      {item.name}
                    </ListItem.Title>
                    {item._id === currentConversation.leaderId && (
                      <ListItem.Subtitle numberOfLines={1}>
                        Trưởng nhóm
                      </ListItem.Subtitle>
                    )}
                  </ListItem.Content>

                  {userProfile._id === currentConversation.leaderId &&
                    item._id !== currentConversation.leaderId && (
                      <View style={styles.buttonWrap}>
                        <Button
                          containerStyle={styles.buttonContainer}
                          buttonStyle={[
                            styles.buttonStyle,
                            {borderColor: 'red'},
                          ]}
                          titleStyle={[styles.buttonTitle, {color: 'red'}]}
                          title="Xóa"
                          type="outline"
                          onPress={() =>
                            handleDeleteMember(item._id, item.name)
                          }
                        />
                      </View>
                    )}
                </ListItem>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#E5E6E8',
                    height: 1,
                    marginLeft: 82,
                  }}></View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <EmptyData />
      )}
    </SafeAreaView>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  buttonWrap: {
    // backgroundColor: "red",
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonStyle: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    minWidth: 60,
  },
  buttonTitle: {fontSize: 13},
  buttonContainer: {
    borderRadius: 50,
    marginRight: 10,
    minWidth: 60,
  },
});
