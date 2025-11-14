import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/users',
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        fetchUsers: builder.query({
            query: () => ({ url: '/' }),
            providesTags: ['Users']
        })
    }),
})

export const { useFetchUsersQuery } = userApi