import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Divider, Icon} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {voteApi} from '../api';
import VoteProgress from '../components/VoteProgress';
import {useGoback} from '../hooks';
import {MAIN_COLOR, SCREEN_WIDTH} from '../styles';
import commonFuc from '../utils/commonFuc';

const VoteDetailScreen = ({navigation}) => {
  useGoback(navigation);

  const {currentVote} = useSelector(state => state.message);
  const {userProfile} = useSelector(state => state.me);
  const [isDisable, setIsDisable] = useState(true);

  const options = currentVote.options;
  const totalOfVotes = commonFuc.getTotalOfVotes(options);

  const currentUserVotes = commonFuc.getCurrentUserVotes(
    options,
    userProfile._id,
  );

  const choicesRef = useRef(currentUserVotes);

  const handleOnChangeVote = (isChecked, optionId) => {
    if (isChecked) {
      const oldChoices = choicesRef.current;
      choicesRef.current = [...oldChoices, optionId];
    } else {
      const oldChoices = choicesRef.current;

      const newChoices = oldChoices.filter(optionEle => optionEle !== optionId);

      choicesRef.current = newChoices;
    }

    const isEqual =
      currentUserVotes.length === choicesRef.current.length &&
      currentUserVotes.every(val => choicesRef.current.includes(val));

    setIsDisable(isEqual);
  };

  const handleOnPressVote = () => {
    const oldChoices = currentUserVotes;
    const newChoices = choicesRef.current;

    const deleteChoices = commonFuc.getDifferentValue(oldChoices, newChoices);
    const addChoices = commonFuc.getDifferentValue(newChoices, oldChoices);
    const messageId = currentVote._id;

    if (deleteChoices.length > 0) {
      handleOnSubmit(messageId, {options: deleteChoices}, false);
    }
    if (addChoices.length > 0) {
      handleOnSubmit(messageId, {options: addChoices}, true);
    }
  };

  const handleOnSubmit = async (messageId, options, isSelectOption) => {
    try {
      if (isSelectOption) {
        const response = await voteApi.selectOption(messageId, options);
      } else {
        const response = await voteApi.deleteSelectOption(messageId, options);
      }
      commonFuc.notifyMessage('Bình chọn thành công');
      navigation.goBack();
    } catch (error) {
      console.log('Có lỗi xảy ra');
      commonFuc.notifyMessage('Có lỗi xảy ra');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          {currentVote.content}
        </Text>
        <Text style={{...styles.smallText, color: 'grey'}}>
          {`${currentVote.user.name} • ${commonFuc.getNumberOfDays(
            currentVote.createdAt,
          )}`}
        </Text>

        {totalOfVotes > 0 && (
          <TouchableOpacity>
            <Text style={{...styles.smallText, color: MAIN_COLOR}}>
              {commonFuc.getNumOfPeopleVoted(options)} Người đã bình chọn
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Icon name="bars" type="antdesign" size={14} color="grey" />
          <Text style={{...styles.smallText, color: 'grey', marginLeft: 5}}>
            Chọn được nhiều phương án
          </Text>
        </View>

        <Divider style={{marginVertical: 8}} />

        {options.map((option, index) => {
          return (
            <VoteProgress
              key={option._id}
              totalOfVotes={totalOfVotes}
              // option="The value of the progress indicator for the determinate variant. Value between 0 and 1.The value of the progress indicator for the determinate variant. Value between 0 and 1."
              option={option}
              maxWidth={SCREEN_WIDTH}
              isCheckBoxType={true}
              onChange={handleOnChangeVote}
            />
          );
        })}
        <Button title="+ Thêm phương án" type="clear" />
      </ScrollView>
      <Button
        title="Bình chọn"
        disabled={isDisable}
        buttonStyle={{borderRadius: 50}}
        containerStyle={{width: '100%', borderRadius: 50}}
        onPress={handleOnPressVote}
      />
    </SafeAreaView>
  );
};

export default VoteDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    // flexDirection: 'column',
    padding: 10,
    flex: 1,
  },
  textContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  smallText: {fontSize: 12, textAlignVertical: 'center'},
});
