import axiosClient from './axiosClient';

const BASE_URL = '/friends';

const friendApi = {
  fetchFriends: () => {
    return axiosClient.get(BASE_URL);
  },

  acceptFriend: userId => {
    const url = `${BASE_URL}/${userId}`;
    return axiosClient.post(url);
  },

  deleteFriend: userId => {
    const url = `${BASE_URL}/${userId}`;
    return axiosClient.delete(url);
  },

  fetchFriendRequests: () => {
    const url = `${BASE_URL}/invites`;
    return axiosClient.get(url);
  },

  deleteFriendRequest: userId => {
    const url = `${BASE_URL}/invites/${userId}`;
    return axiosClient.get(url);
  },

  addFriendRequest: userId => {
    const url = `${BASE_URL}/invites/me/${userId}`;
    return axiosClient.post(url);
  },

  deleteOwnFriendRequest: userId => {
    const url = `${BASE_URL}/invites/me/${userId}`;
    return axiosClient.delete(url);
  },
};

export default friendApi;
