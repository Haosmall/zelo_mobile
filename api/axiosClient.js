import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {AsyncStorage} from 'react-native';
// import config from "../config";
import {REACT_APP_API_URL} from '../constants';

const axiosClient = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      const {code, auto} = response.data;

      if (code === 401) {
        if (auto === 'yes') {
          return refreshToken().then(async response => {
            console.log('get token refreshToken>>', response.data);
            const {token} = response.data;
            await AsyncStorage.setItem('token', token);
            axiosClient.setToken(token);

            const config = response.config;
            config.headers['x-access-token'] = token;
            config.baseURL = REACT_APP_API_URL;
            return axiosClient(config);
          });
        }
      }

      return response.data;
    }
    return response;
  },

  error => {
    // return error.response;
    throw error;
  },
);

async function refreshToken() {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  return axiosClient.post('/auth/refresh-token', {
    refreshToken,
  });
}

export default axiosClient;
