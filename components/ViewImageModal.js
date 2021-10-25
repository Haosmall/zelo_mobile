import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
// import defaultCoverImage from '../assets/default-cover-image.jpg';
// import ImageView from 'react-native-image-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import {DEFAULT_IMAGE_MODAL} from '../constants';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import RNFetchBlob from 'react-native-fetch-blob';
import commonFuc from '../utils/commonFuc';

const ViewImageModal = props => {
  const {imageProps, setImageProps} = props;

  const checkPermission = async () => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = () => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = imageProps.imageUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        commonFuc.notifyMessage('Tải ảnh thành công');
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const handleCloseModal = () => {
    setImageProps(DEFAULT_IMAGE_MODAL);
  };
  return (
    <Modal
      visible={imageProps.isVisible}
      transparent={true}
      onRequestClose={handleCloseModal}>
      <ImageViewer
        imageUrls={[{url: imageProps.imageUrl}]}
        onCancel={handleCloseModal}
        onSwipeDown={handleCloseModal}
        saveToLocalByLongPress={false}
        renderIndicator={() => (
          <View style={styles.indicator}>
            <TouchableOpacity onPress={handleCloseModal}>
              <Icon name="arrowleft" type="antdesign" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.text}>{imageProps.userName}</Text>
            <TouchableOpacity onPress={checkPermission}>
              <Icon name="download" type="antdesign" size={22} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </Modal>
  );
};

export default ViewImageModal;

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {color: '#fff', fontSize: 18, marginLeft: 15},
});
