import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {meApi} from '../api';

const KEY = 'me';

const initialState = {
  isLoading: false,
  userProfile: {},
};

export const fetchProfile = createAsyncThunk(
  `${KEY}/fetchProfile`,
  async () => {
    const data = await meApi.fetchProfile();
    return data;
  },
);

// export const fetchProfile = createAsyncThunk(
// 	`${KEY}/fetchProfile`,
// 	async (params, thunkApi) => {
// 		const data = await meApi.fetchProfile();
// 		return data;
// 	}
// );

const meSlice = createSlice({
  name: KEY,
  initialState,

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetMeSlice: (state, action) => {
      Object.assign(state, initialState);
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // Đang xử lý
    [fetchProfile.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchProfile.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userProfile = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchProfile.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = meSlice;
export const {setLoading, resetMeSlice} = actions;
export default reducer;
