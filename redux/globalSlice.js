import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import io from 'socket.io-client';
import {REACT_APP_API_URL} from '../constants';

const KEY = 'global';

const globalSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    isLogin: false,
    modalVisible: false,
    currentUserId: '',
    keyboardHeight: 280,
    socket: {},
  },

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setModalVisible: (state, action) => {
      state.modalVisible = action.payload;
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    setKeyboardHeight: (state, action) => {
      let keyboardHeight = 280;
      const keyboardHeightStr = action.payload;
      if (keyboardHeightStr.length > 0) {
        keyboardHeight = parseFloat(keyboardHeightStr);
      }
      state.keyboardHeight = keyboardHeight;
    },
    initSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {},
});

const {reducer, actions} = globalSlice;
export const {
  setLoading,
  setLogin,
  setModalVisible,
  setCurrentUserId,
  setKeyboardHeight,
  initSocket,
} = actions;
export default reducer;
