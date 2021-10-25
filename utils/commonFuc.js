import {Platform, ToastAndroid, AlertIOS} from 'react-native';
import {conversationApi} from '../api';
import {REACTIONS} from '../constants';
import {
  clearMessagePages,
  fetchListLastViewer,
  updateCurrentConversation,
} from '../redux/messageSlice';
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

      return acronym;
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
};

export const handleCreateChat = async (userId, navigation, dispatch) => {
  try {
    const response = await conversationApi.addConversation(userId);

    if (response?.isExists) {
      handleEnterChat(response._id, navigation, dispatch);
    }
  } catch (error) {
    console.log('Có lỗi xảy ra', error);
  }
};

const handleEnterChat = (conversationId, navigation, dispatch) => {
  dispatch(clearMessagePages());
  dispatch(updateCurrentConversation({conversationId}));
  dispatch(fetchListLastViewer({conversationId}));
  console.log('conver: ', conversationId);
  navigation.navigate('Nhắn tin', {
    conversationId,
  });
};

export default commonFuc;
