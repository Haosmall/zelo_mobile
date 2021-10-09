import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {friendApi} from '../api';

const KEY = 'friend';

export const fetchFriends = createAsyncThunk(
  `${KEY}/fetchFriends`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchFriends(params);
    return data;
  },
);

const friendSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    listFriends: [],
    searchFriend: {},
  },

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSearchFriend: (state, action) => {
      state.searchFriend = action.payload;
    },
    updateFriendStatus: (state, action) => {
      const oldSearchFriend = state.searchFriend;
      const status = action.payload;
      const newSearchFriend = {...oldSearchFriend, status};
      state.searchFriend = newSearchFriend;
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
export const {setLoading, setSearchFriend, updateFriendStatus} = actions;
export default reducer;
