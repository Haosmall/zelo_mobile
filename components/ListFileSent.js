import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {DEFAULT_IMAGE_MODAL, messageType} from '../constants';
import globalStyles, {
  SCREEN_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../styles';
import commonFuc from '../utils/commonFuc';
import ViewImageModal from './ViewImageModal';

export default function ListFileSent(props) {
  const {listFiles, type} = props;
  const [imageProps, setImageProps] = useState(DEFAULT_IMAGE_MODAL);

  const handleViewImage = (url, fileName, isImage) => {
    setImageProps({
      isVisible: true,
      userName: fileName,
      content: isImage ? [{url: url || DEFAULT_COVER_IMAGE}] : url,
      isImage: isImage,
    });
  };

  const IMAGE_SIZE = WINDOW_WIDTH / 4;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Pressable
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          {listFiles.length > 0 &&
            listFiles.map(file => {
              const {_id, userId, content, type, createdAt} = file;
              return type === messageType.FILE ? (
                <Pressable
                  key={_id}
                  onPress={() => alert(commonFuc.getFileName(content))}>
                  <View style={{backgroundColor: '#fff'}}>
                    <Text>{commonFuc.getFileName(content)}</Text>
                    <View style={styles.bottomDivider}></View>
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  key={_id}
                  onPress={() =>
                    handleViewImage(
                      content,
                      commonFuc.getFileName(content).split('.')[0],
                      type === messageType.IMAGE,
                    )
                  }>
                  {type === messageType.IMAGE ? (
                    <Image
                      style={{
                        width: IMAGE_SIZE,
                        height: IMAGE_SIZE,
                        margin: 8,
                        borderRadius: 10,
                      }}
                      source={{uri: content}}
                      onPress={() =>
                        handleViewImage(
                          content,
                          commonFuc.getFileName(content).split('.')[0],
                          true,
                        )
                      }
                    />
                  ) : (
                    <View style={{margin: 8}}>
                      <View
                        style={{
                          width: IMAGE_SIZE,
                          height: IMAGE_SIZE,
                          aspectRatio: 16 / 9,
                          backgroundColor: '#000',
                          justifyContent: 'center',
                          borderRadius: 10,
                        }}>
                        <Icon
                          name="play"
                          type="antdesign"
                          color="#fff"
                          size={30}
                        />
                      </View>
                      <Text>{commonFuc.getFileName(content)}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
        </Pressable>
        {listFiles.length == 0 && (
          <View style={styles.emty}>
            <Icon name="warning" type="antdesign" />
            <Text style={styles.text}>{`Không có ${
              type === messageType.IMAGE
                ? 'hình ảnh'
                : type === messageType.VIDEO
                ? 'video'
                : 'file'
            } nào`}</Text>
          </View>
        )}
      </ScrollView>
      <ViewImageModal imageProps={imageProps} setImageProps={setImageProps} />
    </SafeAreaView>
  );
}
ListFileSent.propTypes = {
  listFiles: PropTypes.array,
  type: PropTypes.string,
};

ListFileSent.defaultProps = {
  listFiles: [],
  type: messageType.IMAGE,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    alignItems: 'center',
    width: '100%',
    height: WINDOW_HEIGHT * 0.28,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
