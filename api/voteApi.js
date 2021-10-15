import axiosClient from './axiosClient';

const BASE_URL = '/votes';

const voteApi = {
  addVote: vote => {
    return axiosClient.post(BASE_URL, vote);
  },

  addVoteOption: (messageId, option) => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.post(url, option);
  },

  deleteVoteOption: (messageId, option) => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.delete(url, option);
  },

  selectOption: (messageId, option) => {
    const url = `${BASE_URL}/${messageId}/choices`;
    return axiosClient.post(url, option);
  },

  deleteSelectOption: (messageId, option) => {
    const url = `${BASE_URL}/${messageId}/choices`;
    return axiosClient.delete(url, option);
  },
};

export default voteApi;
