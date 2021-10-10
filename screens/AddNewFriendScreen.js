import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Button, Input, ListItem} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {userApi} from '../api';
import {setSearchFriend} from '../redux/friendSlice';
import {validateUsername} from '../utils/validator';

export default function AddNewFriendScreen({navigation}) {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef('');

  useEffect(() => {
    // dispatch(fetchFriends({}));
  }, []);

  const handleSearchFriendSubmit = async () => {
    // const userName = 'nhathao00852@gmail.com';
    // const userName = '0398765421';
    // const userName = '0987654321';
    const userName = inputRef.current;

    const valid = validateUsername(userName);

    if (!valid.isEmail && !valid.isPhoneNumber) {
      setIsError(true);
      setErrorMessage('Số điện thoại/email không hợp lệ');
    } else {
      const response = await userApi.fetchUsers(userName);

      if (typeof response.status === 'string') {
        dispatch(setSearchFriend(response));
        navigation.navigate('Chi tiết bạn bè');
      } else {
        console.log('looix');
      }
      console.log(valid);
      console.log(response);
      setIsError(false);
      setErrorMessage('');
    }
  };

  return (
    <SafeAreaView>
      <ListItem containerStyle={{paddingHorizontal: 0}}>
        <Input
          ref={inputRef}
          // defaultValue="0987654321"
          renderErrorMessage={isError}
          errorMessage={errorMessage}
          inputStyle={{marginRight: 16}}
          inputContainerStyle={styles.inputSearchContainer}
          // containerStyle={{backgroundColor: 'red', paddingHorizontal: 0}}
          placeholder="Nhập số điện thoại/email"
          onChangeText={value => (inputRef.current = value)}
          rightIcon={
            <Button
              title="Tìm"
              buttonStyle={styles.buttonSearch}
              onPress={handleSearchFriendSubmit}
            />
          }
        />
      </ListItem>

      <ScrollView></ScrollView>
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
  buttonSearch: {
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 5,
  },
  inputSearchContainer: {
    borderBottomWidth: 0,
    borderRadius: 50,
    // backgroundColor: 'cyan',
    // paddingHorizontal: 15,
  },
});
