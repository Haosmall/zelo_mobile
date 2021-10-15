import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import VoteProgress from '../components/VoteProgress';
import {useGoback} from '../hooks';
import {SCREEN_WIDTH} from '../styles';
import commonFuc from '../utils/commonFuc';

const VoteDetailScreen = ({navigation}) => {
  useGoback(navigation);

  const {currentVote} = useSelector(state => state.message);
  const options = currentVote.options;
  const numberOfVotes = commonFuc.getNumberOfVotes(options);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {options.map((option, index) => {
          const percent =
            numberOfVotes === 0
              ? numberOfVotes
              : (option.userIds.length * 100) / numberOfVotes;
          return (
            <VoteProgress
              key={option._id}
              percent={`${percent}%`}
              // option="The value of the progress indicator for the determinate variant. Value between 0 and 1.The value of the progress indicator for the determinate variant. Value between 0 and 1."
              option={option.name}
              maxWidth={SCREEN_WIDTH}
              isCheckBoxType={true}
            />
          );
        })}
      </ScrollView>
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
