import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../reducers/useSlice';
import postReducer from '../reducers/postSlice';
import commentsSlice from '../reducers/commentsSlice'
// імпортуйте інші ред'юсери

const rootReducer = combineReducers({
  user: userReducer,
  posts: postReducer,
  comments: commentsSlice,
  // додайте інші ред'юсери
});

export default rootReducer;