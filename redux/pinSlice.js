import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import pinMessagesApi from '../api/pinMessagesApi';

const KEY = 'pin';

export const fetchPinMessages = createAsyncThunk(
  `${KEY}/fetchPinMessages`,
  async (params, thunkApi) => {
    const {conversationId} = params;
    const response = await pinMessagesApi.fetchPinMessages(conversationId);
    return response.data ? [] : response;
  },
);

const pinSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    pinMessages: [],
  },

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // Đang xử lý
    [fetchPinMessages.pending]: (state, action) => {
      // state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchPinMessages.fulfilled]: (state, action) => {
      // state.isLoading = false;
      state.pinMessages = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchPinMessages.rejected]: (state, action) => {
      // state.isLoading = false;
    },
  },
});

const {reducer, actions} = pinSlice;
export const {setLoading} = actions;
export default reducer;
