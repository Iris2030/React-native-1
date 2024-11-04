import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  posts: any[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<any>) => {
      state.posts.push(action.payload);
    },
    setPosts: (state, action: PayloadAction<any[]>) => {
      state.posts = action.payload;
    },
  },
});

export const { addPost, setPosts } = postSlice.actions;
export default postSlice.reducer;