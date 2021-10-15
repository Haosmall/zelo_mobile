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
export const fetchFriendRequests = createAsyncThunk(
  `${KEY}/fetchFriendRequest`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchFriendRequests();
    return data;
  },
);
export const fetchMyFriendRequests = createAsyncThunk(
  `${KEY}/fetchMyFriendRequest`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchMyFriendRequests();
    return data;
  },
);

const friendSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    listFriends: [],
    searchFriend: {},
    friendRequests: [],
    myFriendRequests: [],
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

    addNewFriendRequest: (state, action) => {
      const myOldFriendRequests = state.myFriendRequests;
      const newFriendRequest = state.searchFriend;
      const myNewFriendRequests = [...myOldFriendRequests, newFriendRequest];
      state.myFriendRequests = myNewFriendRequests;
    },

    cancelMyFriendRequest: (state, action) => {
      const userId = action.payload;
      const myOldFriendRequests = state.myFriendRequests;
      // delete request from list
      const myNewFriendRequests = myOldFriendRequests.filter(
        requestEle => requestEle._id !== userId,
      );
      state.myFriendRequests = myNewFriendRequests;
    },

    deleteFriendRequest: (state, action) => {
      const userId = action.payload;
      const oldFriendRequests = state.friendRequests;
      // delete request from list
      const newFriendRequests = oldFriendRequests.filter(
        requestEle => requestEle._id !== userId,
      );
      state.friendRequests = newFriendRequests;
    },

    inviteFriendRequest: (state, action) => {
      const details = action.payload;
      const oldFriendRequests = state.friendRequests;
      state.friendRequests = [...oldFriendRequests, details];
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // ========================== fetchFriends ==========================
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

    // ========================== fetchFriendRequests ==========================
    // Đang xử lý
    [fetchFriendRequests.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFriendRequests.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.friendRequests = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFriendRequests.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // ========================== fetchMyFriendRequests ==========================
    // Đang xử lý
    [fetchMyFriendRequests.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchMyFriendRequests.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.myFriendRequests = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchMyFriendRequests.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = friendSlice;
export const {
  setLoading,
  setSearchFriend,
  updateFriendStatus,
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  inviteFriendRequest,
} = actions;
export default reducer;
