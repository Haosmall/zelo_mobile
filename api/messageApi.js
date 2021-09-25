import axiosClient from './axiosClient';

const BASE_URL = '/messages';

const messageApi = {
  fetchMessage: (conversationId, params) => {
    const url = `${BASE_URL}/${conversationId}`;
    return axiosClient.get(url, {params});
  },

  sendMessage: message => {
    const url = `${BASE_URL}/text`;
    return axiosClient.post(url, message);
  },
  deleteMessage: messageId => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.delete(url);
  },
  deleteMessageOnlyMe: messageId => {
    const url = `${BASE_URL}/${messageId}/only`;
    return axiosClient.delete(url);
  },
  addReaction: (messageId, type) => {
    const url = `${BASE_URL}/${messageId}/reacts/${type}`;
    return axiosClient.post(url);
  },
  sendFileMessage: (file, params) => {
    const {type, conversationId} = params;

    const config = {
      params: {
        type,
        conversationId,
      },
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        console.log(percentCompleted);
      },
    };

    return axiosClient.post(`${BASE_URL}/files`, file, config);
  },
};

export default messageApi;
