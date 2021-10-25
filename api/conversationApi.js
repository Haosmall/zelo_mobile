import axiosClient from './axiosClient';

const BASE_URL = '/conversations';

const conversationApi = {
  fetchConversations: params => {
    return axiosClient.get(BASE_URL, {params});
  },

  fetchConversation: conversationId => {
    const url = `${BASE_URL}/${conversationId}`;
    return axiosClient.get(url);
  },

  fetchClassifies: classifyId => {
    const url = `${BASE_URL}/classifies/${classifyId}`;
    return axiosClient.get(url);
  },

  addConversation: userId => {
    const url = `${BASE_URL}/individuals/${userId}`;
    return axiosClient.post(url);
  },

  addGroup: (userId, groupInfo) => {
    const url = `${BASE_URL}/groups/${userId}`;
    return axiosClient.post(url, groupInfo);
  },

  updateName: (id, name) => {
    const url = `${BASE_URL}/${id}/name`;
    return axiosClient.patch(url, name);
  },

  updateAvatar: (groupId, avatar) => {
    const url = `${BASE_URL}/${groupId}/avatar`;
    return axiosClient.patch(url, avatar);
  },

  updateNotify: (conversationId, isNotify) => {
    const url = `${BASE_URL}/${conversationId}/notify/${isNotify}`;
    return axiosClient.patch(url);
  },

  fetchListLastViewer: conversationId => {
    return axiosClient.get(`${BASE_URL}/${conversationId}/last-view`);
  },
};

export default conversationApi;
