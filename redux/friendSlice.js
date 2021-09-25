import {createSlice} from '@reduxjs/toolkit';

const KEY = 'friend';

// export const fetchProfile = createAsyncThunk(
// 	`${KEY}/fetchProfile`,
// 	async (params, thunkApi) => {
// 		const data = await meApi.fetchProfile();
// 		return data;
// 	}
// );

const friendSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
  },

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // // Đang xử lý
    // [fetchProfile.pending]: (state, action) => {
    // 	state.isLoading = true;
    // },
    // // Xử lý khi thành công
    // [fetchProfile.fulfilled]: (state, action) => {
    // 	state.isLoading = false;
    // 	state.userProfile = action.payload;
    // },
    // // Xử lý khi bị lỗi
    // [fetchProfile.rejected]: (state, action) => {
    // 	state.isLoading = false;
    // },
  },
});

const {reducer, actions} = friendSlice;
export const {setLoading} = actions;
export default reducer;
