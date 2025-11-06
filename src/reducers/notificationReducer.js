import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        update: (state, action) => {
            return action.payload
        },
        clear: () => {
            return null
        }
    }
})

const { update, clear } = notificationSlice.actions

export const notify = (notification, timeout = 5_000) => {
    return async (dispatch) => {
        dispatch(update(notification))
        setTimeout(() => dispatch(clear()), timeout)
    }
}

export default notificationSlice.reducer