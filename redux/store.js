import {configureStore} from '@reduxjs/toolkit';
import friend from './friendSlice';
import global from './globalSlice';
import me from './meSlice';
import message from './messageSlice';

const rootReducer = {
  global,
  me,
  friend,
  message,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
