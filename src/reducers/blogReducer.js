import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'


const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs: (state, action) => {
            return action.payload.sort((a, b) => b.likes - a.likes)
        },
        addBlog: (state, action) => {
            state.push(action.payload)
            return state
        },
        clearBlogs: () => [],
        deleteBlog: (state, action) => {
            return state.filter((it) => it.id !== action.payload)
        }
    }
})

export const { setBlogs, deleteBlog } = blogSlice.actions

export const fetchBlogs = () => {
    return async (dispatch) => {
        dispatch(setBlogs(
            await blogService.getAll()
        ))
    }
}

export const removeBlog = (id) => {
    return async (dispatch) => {
        dispatch(deleteBlog(id))
        await blogService.remove(id)
    }
}

export const { clearBlogs, addBlog } = blogSlice.actions

export default blogSlice.reducer