import React, {useState} from 'react';
import {
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {messageApi} from '../api';
import {messageType} from '../constants';

const ImagePickerModal = props => {
  const {modalVisible, setModalVisible} = props;

  const {currentConversationId} = useSelector(state => state.message);

  const [fileType, setfileType] = useState('');

  const showImagePicker = async (isVideo = false) => {
    //Xin quyền try cập vào thư viện
    // const permissionResult =
    //   await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   alert('Bạn đã từ chối truy cập vào ảnh của bạn trên ứng dụng này! ');
    //   return;
    // }
    // const mediaTypes = isVideo
    //   ? ImagePicker.MediaTypeOptions.Videos
    //   : ImagePicker.MediaTypeOptions.Images;
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes,
    // });
    // console.log(result);
    // if (!result.cancelled) {
    //   // setfileType(result.type);
    //   // console.log(result.type);
    //   console.log(result.uri);
    //   await handleSendImage(result.uri);
    // }

    const options = {
      mediaType: 'mixed',
      includeBase64: true,
    };

    await launchImageLibrary(options, async res => {
      console.log('res = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res.assets[0];
        console.log('source = ', source.uri);
        await handleSendImage(source);
      }
    });
  };

  const openCamera = async () => {
    // Xin quyền truy cập camera
    // const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   alert('Bạn đã từ chối truy cập vào máy ảnh của bạn trên ứng dụng này! ');
    //   return;
    // }
    // const result = await ImagePicker.launchCameraAsync();
    // console.log(result);
    // if (!result.cancelled) {
    //   console.log(result.uri);
    //   await handleSendImage(result.uri);
    // }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'Ứng dụng cần quyền truy cập vào máy ảnh của bạn',
          buttonNeutral: 'Hỏi lại tôi sau',
          buttonNegative: 'Hủy',
          buttonPositive: 'Đồng ý',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      } else {
        console.log('Camera permission given');
      }
    } catch (err) {
      console.warn(err);
    }

    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };
    launchCamera(options, async res => {
      console.log('res = ', res);

      if (res.didCancel) {
        console.log('User cancelled camera');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res.assets[0];
        await handleSendImage(source);
      }
    });
  };

  const handleSendImage = async file => {
    console.log('filePath: ', file);

    const params = {
      type: messageType.IMAGE,
      conversationId: currentConversationId,
    };

    const fileNameSplit = file.fileName.split('.');
    const fileName = fileNameSplit[0];
    const fileBase64 = file.base64;
    const fileExtension = `.${fileNameSplit[1]}`;

    const body = {fileName, fileExtension, fileBase64};

    console.log('body: ', body);
    handleCloseModal();

    // messageApi
    //   .sendFileBase64Message(body, params)
    //   .then(res => {
    //     console.log('Send Message Success', res);
    //     handleCloseModal();
    //   })
    //   .catch(err => console.log('Send Message Fail'));
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={handleCloseModal}
          style={styles.container}>
          <SafeAreaView style={styles.modalView}>
            <Button
              title="Chụp ảnh"
              containerStyle={styles.buttonTop}
              type="clear"
              icon={<IconAntDesign name="addusergroup" size={22} />}
              titleStyle={styles.title}
              onPress={openCamera}
            />
            <Button
              title="Chọn ảnh"
              containerStyle={styles.buttonBottom}
              type="clear"
              icon={<IconAntDesign name="adduser" size={22} />}
              titleStyle={styles.title}
              onPress={() => showImagePicker(false)}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

ImagePickerModal.propTypes = {};

ImagePickerModal.defaultProps = {};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "rgba(52, 52, 52, 0.3)",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: 10,
  },
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: "100%",
  },
  modalView: {
    width: '100%',
    minHeight: 200,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 35,
    alignItems: 'center',

    // add shadows for iOS only
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,

    // add shadows for Android only
    // No options for shadow color, shadow offset, shadow opacity like iOS
    elevation: 10,
  },
  button: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
  },
  buttonTop: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
    borderTopStartRadius: BUTTON_RADIUS,
    borderTopEndRadius: BUTTON_RADIUS,
  },
  buttonBottom: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
    borderBottomStartRadius: BUTTON_RADIUS,
    borderBottomEndRadius: BUTTON_RADIUS,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: '100',
    color: 'black',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ImagePickerModal;
