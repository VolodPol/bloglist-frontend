import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from '../reducers/notificationReducer.js'
import blogReducer from '../reducers/blogReducer.js'
import { blogApi } from './api/blogApi.js'

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogReducer,
        [blogApi.reducerPath]: blogApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(blogApi.middleware),
})
