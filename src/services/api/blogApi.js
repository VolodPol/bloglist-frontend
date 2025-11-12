import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const authQuery = fetchBaseQuery(({
    baseUrl: '/api/blogs',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().authentication.token
        if (token) headers.set('Authorization', `Bearer ${token}`)
        return headers
    }
}))

export const blogApi = createApi({
    reducerPath: 'blogApi',
    baseQuery: authQuery,
    tagTypes: ['Blogs'],
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: () => ({ url: '/' }),
            providesTags: ['Blogs'],
        }),
        createBlog: builder.mutation({
            query: (newBlog) => ({
                url: '/',
                method: 'POST',
                body: newBlog,
            }),
            invalidatesTags: ['Blogs'],
        }),
        updateBlog: builder.mutation({
            query: ({ id, updated }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updated,
            }),
            invalidatesTags: ['Blogs'],
        }),
        removeBlog: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Blogs'],
        }),
    }),
})

export const { useLazyGetBlogsQuery, useCreateBlogMutation, useRemoveBlogMutation, useUpdateBlogMutation } = blogApi