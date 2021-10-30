import React from 'react';
import {
  FlatList,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {meApi} from '../api';
import ContactAction from '../components/ContactAction';
import FriendItem from '../components/FriendItem';
import {friendType} from '../constants';
import {fetchFriendById} from '../redux/friendSlice';
import {setLoading} from '../redux/meSlice';
import globalStyles from '../styles';

const PhonebookScreen = ({navigation}) => {
  const {isLoading, phoneBooks} = useSelector(state => state.me);
  const dispatch = useDispatch();

  const handleSyncContacts = async () => {
    dispatch(setLoading(true));
    const contacts = await handleGetContacts();
    const phones = handleContactPhoneNumber(contacts);

    console.log('cmh ', phones);
    if (phones.length > 0) {
      try {
        const response = await meApi.syncContacts(phones);
        console.log('Post Sync: ', response);
        dispatch(fetchSyncContacts());
      } catch (error) {
        console.log('Post Sync error: ', error);
      }
    }
    dispatch(setLoading(false));
  };

  const handleGetContacts = async () => {
    let contacts = [];
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );

      if (permission === 'granted') {
        contacts = await Contacts.getAll();
        // console.log(contacts);
      }
    } catch (error) {
      console.log('Contacts: ', error);
    }

    return contacts;
  };

  const handleContactPhoneNumber = contacts => {
    if (!contacts) return [];
    const phonesTemp = contacts.map(contactEle => {
      const phone = contactEle.phoneNumbers[0].number
        .replaceAll(/\s/g, '')
        .replaceAll(/-/g, '')
        .replaceAll('+84', '0');
      const name = contactEle.displayName;
      return {name, phone};
    });

    const phones = phonesTemp.filter(phoneEle => validatePhone(phoneEle.phone));

    return phones;
  };

  const validatePhone = phone => {
    if (!phone) return false;
    const regex = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    return regex.test(phone);
  };

  const handleGoToPersonalScreen = async userId => {
    await dispatch(fetchFriendById({userId}));
    navigation.navigate('Chi tiết bạn bè');
  };

  return (
    <SafeAreaView>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={globalStyles.spinnerTextStyle}
      />
      <ContactAction
        name="phone-square"
        type="font-awesome"
        title="Đồng bộ danh bạ"
        backgroundColor="#70c43b"
        handlePress={handleSyncContacts}
      />
      {phoneBooks.length > 0 ? (
        <FlatList
          data={phoneBooks}
          keyExtractor={(_, index) => index}
          initialNumToRender={12}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={
                item.isExists ? () => handleGoToPersonalScreen(item._id) : null
              }>
              <View style={{backgroundColor: '#fff'}}>
                <FriendItem
                  name={item.name}
                  avatar={item?.avatar}
                  type={item?.status ? 'DETAILS' : friendType.DONT_HAVE_ACCOUNT}
                  userId={item?._id || item.username}
                  navigation={navigation}
                />
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#E5E6E8',
                    height: 1,
                    marginLeft: 82,
                  }}></View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emty}>
          <Icon name="warning" type="antdesign" />
          <Text style={styles.text}>Không có số điện thoại nào</Text>
        </View>
      )}
      {/* <ScrollView>
        {phoneBooks &&
          phoneBooks.map(phone => {
            return (
              <TouchableOpacity
                key={phone.username}
                onPress={
                  phone.isExists ? () => handleGoToPersonalScreen(_id) : null
                }>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    name={phone.name}
                    avatar={phone?.avatar}
                    type={phone?.status || friendType.DONT_HAVE_ACCOUNT}
                    userId={phone?._id || phone.username}
                    navigation={navigation}
                  />
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#E5E6E8',
                      height: 1,
                      marginLeft: 82,
                    }}></View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView> */}
    </SafeAreaView>
  );
};

export default PhonebookScreen;

const styles = StyleSheet.create({
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
