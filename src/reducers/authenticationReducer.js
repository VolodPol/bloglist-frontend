import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login.js'

const USER_LOCAL_ITEM_NAME = 'loggedInUser'

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        token: null,
        user: null
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

const { setUser } = authenticationSlice.actions

export const readUser = () => {
    return async (dispatch) => {
        const loggedUserJSON = window.localStorage.getItem(USER_LOCAL_ITEM_NAME)
        if (loggedUserJSON) {
            const resolvedUser = JSON.parse(loggedUserJSON)
            dispatch(setUser(resolvedUser))
            dispatch(setToken(resolvedUser.token))
        }
    }
}

export const loginUser = (username, password) => {
    return async (dispatch) => {
        const loggedIn = await loginService.login({ username, password })
        window.localStorage.setItem(USER_LOCAL_ITEM_NAME, JSON.stringify(loggedIn))
        dispatch(setToken(loggedIn.token))
        dispatch(setUser(loggedIn))
    }
}

export const logoutUser = () => {
    return async (dispatch) => {
        window.localStorage.clear()
        dispatch(setUser(null))
    }
}

export const { setToken } = authenticationSlice.actions
export default authenticationSlice.reducer