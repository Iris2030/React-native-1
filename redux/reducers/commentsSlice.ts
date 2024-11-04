import { createSlice, createSelector } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {},
    reducers: {
        setComments: (state, action) => {
            const { postId, comments } = action.payload;
            state[postId] = comments.map(comment => ({
                ...comment,
                createdAt: new Date(comment.createdAt).getTime(), // Store as a timestamp
            }));
        },
        addComment: (state, action) => {
            const { postId, comment } = action.payload;
            if (!state[postId]) {
                state[postId] = [];
            }
            // Convert createdAt to timestamp before adding the comment
            const serializableComment = {
                ...comment,
                createdAt: new Date(comment.createdAt).getTime(), // Store as a timestamp
            };
            state[postId].push(serializableComment);
        },
    },
});

// Selector to get all comments from the state
const selectComments = (state) => state.comments;

// Selector to get comments by post ID
export const selectCommentsByPostId = (postId) =>
  createSelector(selectComments, (comments) => comments[postId] || []);

// Export actions and reducer
export const { setComments, addComment } = commentsSlice.actions;
export default commentsSlice.reducer;