import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {},
    reducers: {
        setComments: (state, action) => {
            const { postId, comments } = action.payload;
            state[postId] = comments;
        },
        addComment: (state, action) => {
            const { postId, comment } = action.payload;
            if (!state[postId]) {
                state[postId] = [];
            }
            state[postId].push(comment);
        },
    },
});

export const { setComments, addComment } = commentsSlice.actions;
export default commentsSlice.reducer;