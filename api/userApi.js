import axiosClient from './axiosClient';

const BASE_URL = '/users/search/username';

const userApi = {
  fetchUsers: username => {
    return axiosClient.get(`/users/search/username/${username}`);
  },
};

export default userApi;
