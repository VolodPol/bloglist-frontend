import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs: (state, action) => {
            return [ ...action.payload ].sort((a, b) => b.likes - a.likes)
        },
        addBlog: (state, action) => {
            state.push(action.payload)
        },
        clearBlogs: () => [],
        deleteBlog: (state, action) => {
            return state.filter((it) => it.id !== action.payload)
        },
        addComment: (state, action) => {
            const { blogId, comment } = action.payload
            const blog = state.find(b => b.id === blogId)
            blog.comments = blog.comments.concat(comment)
        }
    }
})

export const { setBlogs, deleteBlog, clearBlogs, addBlog, addComment } = blogSlice.actions
export default blogSlice.reducer