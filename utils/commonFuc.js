import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  AlertIOS,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNRestart from 'react-native-restart';
import {conversationApi} from '../api';
import {ERROR_MESSAGE, messageType, REACTIONS} from '../constants';
import {resetFriendSlice} from '../redux/friendSlice';
import {resetGlobalSlice} from '../redux/globalSlice';
import {resetMeSlice} from '../redux/meSlice';
import {
  clearMessagePages,
  fetchConversations,
  resetMessageSlice,
  setCurrentChannel,
} from '../redux/messageSlice';
import {resetPinSlice} from '../redux/pinSlice';
import dateUtils from './dateUtils';

const commonFuc = {
  getBase64: file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  totalNumberUnread: conversations => {
    if (conversations) {
      return conversations.reduce((n, {numberUnread}) => n + numberUnread, 0);
    }
    return 0;
  },

  getAcronym: name => {
    if (name) {
      const acronym = name
        .split(/\s/)
        .reduce((response, word) => (response += word.slice(0, 1)), '')
        .toUpperCase();

      return acronym.slice(0, 2);
    }
    return '';
  },

  getUniqueListBy: (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  },

  getReactionVisibleInfo: reacts => {
    const unduplicateReactionTypes = reacts
      .filter(
        (element, index, self) =>
          index === self.findIndex(t => t.type === element.type),
      )
      .map(({type}) => type);

    const firstThreeElements = unduplicateReactionTypes.slice(0, 3);

    const reactionVisibleInfo = firstThreeElements
      .map(type => REACTIONS[type - 1])
      .join('');
    return reactionVisibleInfo;
  },

  notifyMessage: message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(message);
    }
  },
  getNumOfPeopleVoted: options => {
    let userIds = [];
    options.map(option => {
      userIds.push(...option.userIds);
    });
    return [...new Set(userIds)].length;
  },
  getTotalOfVotes: options => {
    let totalOfVotes = 0;
    options.map(option => {
      totalOfVotes += option.userIds.length;
    });
    return totalOfVotes;
  },

  getPercentOfVotes: (totalOfVotes, numberOfVotes) => {
    const percent =
      totalOfVotes === 0 ? totalOfVotes : (numberOfVotes * 100) / totalOfVotes;
    return percent;
  },
  getCurrentUserVotes: (options, userId) => {
    let currentUserVotes = [];
    for (const option of options) {
      if (option.userIds.includes(userId)) {
        currentUserVotes.push(option.name);
      }
    }
    return currentUserVotes;
  },
  getDifferentValue: (array1, array2) => {
    let newArray = [];
    for (const element of array1) {
      if (!array2.includes(element)) {
        newArray.push(element);
      }
    }
    return newArray;
  },

  getFileName: fileUrl => {
    const splitted = fileUrl.split('/').slice(-1)[0].split('-');
    const fileName = splitted
      .slice(0, 2)
      .concat(splitted.slice(2).join('-'))[2];
    return fileName;
  },

  getNumberOfDays: dateString => {
    const dateCreated = new Date(dateString);
    const currentDay = new Date();

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = currentDay.getTime() - dateCreated.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays <= 7) {
      return `${diffInDays} ngày trước`;
    }

    return dateUtils.getDate(dateString);
  },

  getNotifyContent: (messageContent, isNotifyDivider) => {
    let content = messageContent;

    switch (messageContent) {
      case messageType.PIN_MESSAGE:
        content = 'Đã ghim một tin nhắn';
        break;

      case messageType.NOT_PIN_MESSAGE:
        content = 'Đã bỏ ghim một tin nhắn';
        break;

      case messageType.CREATE_CHANNEL:
        content = 'Đã tạo một kênh nhắn tin';
        break;

      case messageType.DELETE_CHANNEL:
        content = 'Đã xóa một kênh nhắn tin';
        break;

      case messageType.UPDATE_CHANNEL:
        content = 'Đã đổi tên một kênh nhắn tin';
        break;

      default:
        content = messageContent;
        break;
    }

    if (isNotifyDivider) {
      return content.charAt(0).toLocaleLowerCase() + content.slice(1);
    }

    return content.replace('<b>', '').replace('</b>', '');
  },

  convertMessageToHtml: (content, tagUsers) => {
    let contentHtml = content;

    for (let tagUser of tagUsers) {
      contentHtml = contentHtml.replace(
        `@${tagUser.name}`,
        `<span>@${tagUser.name}</span>`,
      );
    }
    return `<p>${contentHtml}</p>`;
  },
};

export const logout = async dispatch => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('userId');
  dispatch(resetFriendSlice());
  dispatch(resetGlobalSlice());
  dispatch(resetMeSlice());
  dispatch(resetMessageSlice());
  dispatch(resetPinSlice());
  // dispatch(setLogin(false));
  RNRestart.Restart();
};

export const handleCreateChat = async (
  userId,
  navigation,
  dispatch,
  currentConversationId,
) => {
  try {
    const response = await conversationApi.addConversation(userId);
    await dispatch(fetchConversations());
    // if (response?.isExists) {
    console.log('Nhan Tin: ', response._id);
    handleEnterChat(response._id, navigation, dispatch, currentConversationId);
    // }
  } catch (error) {
    console.error('Có lỗi xảy ra', error);
    commonFuc.notifyMessage(ERROR_MESSAGE);
  }
};

const handleEnterChat = (
  conversationId,
  navigation,
  dispatch,
  currentConversationId,
) => {
  if (currentConversationId !== conversationId) {
    dispatch(clearMessagePages());
    // dispatch(updateCurrentConversation({conversationId}));
    // dispatch(
    //   setCurrentChannel({
    //     currentChannelId: conversationId,
    //     currentChannelName: conversationId,
    //   }),
    // );
    // dispatch(fetchListLastViewer({conversationId}));
    // dispatch(fetchMembers({conversationId}));
    dispatch(setCurrentChannel({conversationId}));

    console.log('conver: ', conversationId);
  }
  navigation.navigate('Nhắn tin', {
    conversationId,
  });
};

export const checkPermissionDownloadFile = async fileUrl => {
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === 'ios') {
    downloadFile(fileUrl);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(fileUrl);
        console.log('Storage Permission Granted.');
      } else {
        commonFuc.notifyMessage('Quyền lưu trữ không được cấp');
      }
    } catch (err) {
      // To handle permission related exception
      console.error(err);
    }
  }
};

const downloadFile = fileUrl => {
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // Function to get extention of the file url
  let file_ext = getFileExtention(fileUrl);

  file_ext = '.' + file_ext[0];
  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  const {config, fs} = RNFetchBlob;
  let RootDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: RootDir + '/' + commonFuc.getFileName(fileUrl),
      // RootDir +
      // '/' +
      // fileType +
      // '_' +
      // Math.floor(date.getTime() + date.getSeconds() / 2) +
      // file_ext,
      description: 'downloading file...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true,
    },
  };
  config(options)
    .fetch('GET', fileUrl)
    .then(res => {
      // Alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      commonFuc.notifyMessage('Tải ảnh thành công');
    })
    .catch(err => {
      commonFuc.notifyMessage(ERROR_MESSAGE);
      console.log('Đã có lỗi xảy ra: ', err);
    });
};

const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

export let currentKey = '';

export const makeId = () => {
  currentKey = '';
  const randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 20; i++)
    currentKey += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );

  return currentKey;
};

export const showImagePicker = async (uploadFile, isCoverImage) => {
  const options = {
    mediaType: 'photo',
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
      await handleSendImage(source, uploadFile, isCoverImage);
    }
  });
};

export const openCamera = async (uploadFile, isCoverImage) => {
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
      console.error('ImagePicker Error: ', res.error);
    } else if (res.customButton) {
      console.log('User tapped custom button: ', res.customButton);
      alert(res.customButton);
    } else {
      let source = res.assets[0];
      await handleSendImage(source, uploadFile, isCoverImage);
    }
  });
};

const handleSendImage = async (file, uploadFile, isCoverImage) => {
  const fileNameSplit = file.fileName.split('.');
  const fileName = fileNameSplit[0];
  const fileBase64 = file.base64;
  const fileExtension = `.${fileNameSplit[1]}`;

  const body = {fileName, fileExtension, fileBase64};

  await uploadFile(body, isCoverImage);
};

export default commonFuc;
