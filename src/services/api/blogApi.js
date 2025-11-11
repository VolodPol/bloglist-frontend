import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const blogApi = createApi({
    reducerPath: 'blogApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/blogs' }),
    endpoints: (builder) => ({
        updateBlog: builder.mutation({
            query: ({ id, updated }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updated,
            }),
        }),
    }),
})

export const { useUpdateBlogMutation } = blogApi