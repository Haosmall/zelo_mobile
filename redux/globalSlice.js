import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {AsyncStorage} from 'react-native';

const KEY = 'global';

const globalSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    isLogin: false,
    modalVisible: false,
    currentUserId: '',
    keyboardHeight: 280,
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
} = actions;
export default reducer;
