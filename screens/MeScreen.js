import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import test from '../assets/favicon1.png';
import {setLogin} from '../redux/globalSlice';
import {fetchProfile} from '../redux/meSlice';

export default function MeScreen() {
  const dispatch = useDispatch();

  const {userProfile} = useSelector(state => state.me);

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageIndex, setiImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProfile());
    console.log({userProfile});
  }, []);
  const images = [
    {
      source: {
        uri: userProfile?.avatar || `${test}`,
      },
    },
  ];

  const handleLogOut = () => {
    Alert.alert('Cảnh báo', 'Bạn có muốn đăng xuất không?', [
      {
        text: 'Không',
      },
      {
        text: 'Có',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userId');
          dispatch(setLogin(false));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text>Cá nhân</Text>

      {images.map((image, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setIsImageViewVisible(true);
            setiImageIndex(index);
          }}>
          <Image style={styles.test} source={image.source} />
        </TouchableOpacity>
      ))}

      {/* <ImageView
				images={images}
				imageIndex={imageIndex}
				isVisible={isImageViewVisible}
				onClose={() => setIsImageViewVisible(false)}
				renderFooter={(currentImage) => (
					<View>
						<Text>My footer</Text>
					</View>
				)}
			/> */}
      <Button title="Đăng xuất" onPress={handleLogOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  test: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
});
