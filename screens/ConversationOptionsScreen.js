import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  BackHandler,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  Button,
  View,
} from 'react-native';
// import * as Contacts from 'expo-contacts';
// import * as ImagePicker from 'expo-image-picker';

export default function ConversationOptionsScreen({navigation, route}) {
  const handleGoBack = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleGoBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    };
  }, []);

  let [contacts, setContacts] = useState([]);

  useEffect(() => {
    // (async () => {
    //   const {status} = await Contacts.requestPermissionsAsync();
    //   console.log({status});
    //   if (status === 'granted') {
    //     const {data} = await Contacts.getContactsAsync();
    //     if (data.length > 0) {
    //       data.map(c => console.log(c));
    //       setContacts(data);
    //     }
    //   }
    // })();
  }, []);

  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [fileType, setfileType] = useState('');

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async (isVideo = false) => {
    // Ask the user for the permission to access the media library
    // const permissionResult =
    //   await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   alert("You've refused to allow this appp to access your photos!");
    //   return;
    // }
    // const mediaTypes = isVideo
    //   ? ImagePicker.MediaTypeOptions.Videos
    //   : ImagePicker.MediaTypeOptions.Images;
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes,
    // });
    // // Explore the result
    // console.log(result);
    // if (!result.cancelled) {
    //   setPickedImagePath(result.uri);
    //   setfileType(result.type);
    //   console.log(result.uri);
    //   console.log(result.type);
    // }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    // const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   alert("You've refused to allow this appp to access your camera!");
    //   return;
    // }
    // const result = await ImagePicker.launchCameraAsync();
    // // Explore the result
    // console.log(result);
    // if (!result.cancelled) {
    //   setPickedImagePath(result.uri);
    //   console.log(result.uri);
    // }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>Options</Text>
      {/* <FlatList
				data={contacts}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<Text style={{ marginBottom: 5 }} key={item.id}>
						{item.name}: {item.phoneNumbers[0].number}
					</Text>
				)}
			/> */}
      <View style={styles.screen}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => showImagePicker(false)}
            title="Select an image"
          />
          <Button onPress={openCamera} title="Open camera" />
        </View>

        <View style={styles.imageContainer}>
          {pickedImagePath !== '' && fileType === 'image' && (
            <Image source={{uri: pickedImagePath}} style={styles.image} />
          )}
        </View>

        <Text>{pickedImagePath}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'cover',
  },
  container: {flex: 1, backgroundColor: '#E2E9F1'},
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D0D2D3',
    backgroundColor: '#FFF',
  },
  textInput: {
    bottom: 0,
    maxHeight: 110,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#FFF',
    borderWidth: 1,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
  },
  headerSubTitle: {
    color: '#fff',
    fontSize: 12,
  },
});
