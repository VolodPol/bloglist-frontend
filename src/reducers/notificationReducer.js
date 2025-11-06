import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        update: (state, action) => action.payload,
        clear: () => null
    }
})

const { update, clear } = notificationSlice.actions

export const notify = (notification, isSuccessful = false, timeout = 5_000) => {
    return async (dispatch) => {
        dispatch(update({
            message: notification,
            status: isSuccessful
        }))
        setTimeout(() => dispatch(clear()), timeout)
    }
}

export default notificationSlice.reducer