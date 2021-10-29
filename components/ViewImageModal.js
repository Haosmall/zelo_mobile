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
import commonFuc, {checkPermissionDownloadFile} from '../utils/commonFuc';

const ViewImageModal = props => {
  const {imageProps, setImageProps} = props;

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
            <TouchableOpacity
              onPress={() =>
                checkPermissionDownloadFile(imageProps.imageUrl)
              }>
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
