import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    currentVideo: {
      videoId: null,
      like: [],
      dislike: [],
    },
    loading: false,
    error: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo.videoId = action.payload;
    },
    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    like: (state, action) => {
      if (!state.currentVideo.like.includes(action.payload)) {
        state.currentVideo.like.push(action.payload);
        state.currentVideo.dislike = state.currentVideo.dislike.filter((userId) => userId !== action.payload);
      }
    },
    dislike: (state, action) => {
      if (!state.currentVideo.dislike.includes(action.payload)) {
        state.currentVideo.dislike.push(action.payload);
        state.currentVideo.like = state.currentVideo.like.filter((userId) => userId !== action.payload);
      }
    },
    nullLike: (state, action) => {
      state.currentVideo.like = state.currentVideo.like.filter((userId) => userId !== action.payload);
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, dislike, nullLike } = videoSlice.actions;
export default videoSlice.reducer;
