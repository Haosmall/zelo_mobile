import React, {useState} from 'react';
import {
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSelector} from 'react-redux';
import {messageApi} from '../../api';
import {messageType} from '../../constants';
import globalStyles, {WINDOW_WIDTH} from '../../styles';
import RNFetchBlob from 'react-native-fetch-blob';
import commonFuc from '../../utils/commonFuc';

const ImagePickerModal = props => {
  const {modalVisible, setModalVisible} = props;

  const {currentConversationId} = useSelector(state => state.message);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('upload... 0%');

  const onUploadProgress = percentCompleted => {
    if (percentCompleted < 99) {
      setLoadingText(`upload... ${percentCompleted}%`);
    } else {
      setIsLoading(false);
      setLoadingText('upload... 0%');
    }
  };

  const showImagePicker = async (isVideo = false) => {
    const options = {
      mediaType: isVideo ? 'video' : 'photo',
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
        await handleSendImage(source, isVideo);
      }
    });
  };

  const openCamera = async (isVideo = false) => {
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
      // mediaType: 'photo',
      mediaType: isVideo ? 'video' : 'photo',
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
        await handleSendImage(source, isVideo);
      }
    });
  };

  const handleSendImage = async (file, isVideo) => {
    console.log('filePath: ', file);

    const params = {
      type: isVideo ? messageType.VIDEO : messageType.IMAGE,
      conversationId: currentConversationId,
    };

    if (isVideo) {
      if (file.fileSize > 20971520) {
        commonFuc.notifyMessage('Tối đa 20Mb');
      } else {
        try {
          setIsLoading(true);
          const fileBase64 = await RNFetchBlob.fs.readFile(file.uri, 'base64');
          const body = {
            fileName: file.fileName,
            fileExtension: file.type.replace('video/', '.'),
            fileBase64,
          };

          messageApi
            .sendFileBase64Message(body, params, onUploadProgress)
            .then(res => {
              console.log('Send Message Success', res);
              handleCloseModal();
            })
            .catch(err => {
              console.log('Send Message Fail');
              setIsLoading(false);
            });
        } catch (error) {
          setIsLoading(false);
        }
      }
    } else {
      const fileNameSplit = file.fileName.split('.');
      const fileName = fileNameSplit[0];
      const fileBase64 = file.base64;
      const fileExtension = `.${fileNameSplit[1]}`;

      const body = {fileName, fileExtension, fileBase64};

      console.log('body: ', body);
      handleCloseModal();
      setIsLoading(true);
      messageApi
        .sendFileBase64Message(body, params, onUploadProgress)
        .then(res => {
          console.log('Send Message Success', res);
          handleCloseModal();
        })
        .catch(err => {
          console.log('Send Message Fail');
          setIsLoading(false);
        });
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const ICON_SIZE = 30;

  return (
    <SafeAreaView style={styles.centeredView}>
      <Spinner
        visible={isLoading}
        textContent={loadingText}
        textStyle={globalStyles.spinnerTextStyle}
      />

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
            <ScrollView>
              <Pressable
                style={{
                  width: WINDOW_WIDTH,
                  // backgroundColor: 'cyan',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  padding: 15,
                }}>
                <Button
                  title="Chụp ảnh"
                  containerStyle={styles.buttonContainer}
                  type="clear"
                  icon={<Icon type="feather" name="camera" size={ICON_SIZE} />}
                  titleStyle={styles.title}
                  onPress={() => openCamera(false)}
                  iconPosition="top"
                />

                <Button
                  title="Chọn ảnh"
                  containerStyle={styles.buttonContainer}
                  type="clear"
                  icon={
                    <Icon
                      type="ionicon"
                      name="image-outline"
                      size={ICON_SIZE}
                    />
                  }
                  titleStyle={styles.title}
                  onPress={() => showImagePicker(false)}
                  iconPosition="top"
                />

                <Button
                  title="Quay video"
                  containerStyle={styles.buttonContainer}
                  type="clear"
                  icon={<Icon type="feather" name="video" size={ICON_SIZE} />}
                  titleStyle={styles.title}
                  onPress={() => openCamera(true)}
                  iconPosition="top"
                />

                <Button
                  title="Chọn video"
                  containerStyle={styles.buttonContainer}
                  type="clear"
                  icon={
                    <Icon
                      type="font-awesome"
                      name="file-video-o"
                      size={ICON_SIZE}
                    />
                  }
                  titleStyle={styles.title}
                  onPress={() => showImagePicker(true)}
                  iconPosition="top"
                />
              </Pressable>
            </ScrollView>
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
    width: WINDOW_WIDTH,
    minHeight: 200,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 35,
    alignItems: 'center',
    justifyContent: 'center',

    // add shadows for iOS only
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,

    // add shadows for Android only
    // No options for shadow color, shadow offset, shadow opacity like iOS
    elevation: 10,
  },
  buttonContainer: {
    borderRadius: BUTTON_RADIUS,
    width: '45%',
  },

  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: '100',
    color: 'black',
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
