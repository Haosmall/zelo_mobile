import axiosClient from './axiosClient';

const BASE_URL = '/me';

const meApi = {
  fetchProfile: () => {
    return axiosClient.get(`${BASE_URL}/profile`);
  },

  updateProfile: profile => {
    const url = `${BASE_URL}/profile`;
    return axiosClient.put(url, profile);
  },

  updateAvatar: image => {
    const url = `${BASE_URL}/avatar`;
    return axiosClient.patch(url, image);
  },

  updateCoverImage: image => {
    const url = `${BASE_URL}/cover-image`;
    return axiosClient.patch(url, image);
  },
};

export default meApi;
