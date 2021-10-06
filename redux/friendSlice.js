import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {friendApi} from '../api';

const KEY = 'friend';

export const fetchFriends = createAsyncThunk(
  `${KEY}/fetchFriends`,
  async (params, thunkApi) => {
    const {name = ''} = params;
    const data = await friendApi.fetchFriends(name);
    return data;
  },
);

const friendSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    listFriends: [],
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
    [fetchFriends.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFriends.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.listFriends = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFriends.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = friendSlice;
export const {setLoading} = actions;
export default reducer;
