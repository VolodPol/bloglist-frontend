import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { loginUser, logoutUser, readUser } from '../reducers/authenticationReducer.js'
import { clearBlogs } from '../reducers/blogReducer.js'

export const useUser = () => {
    const user = useSelector(state => state.authentication.user)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(readUser())
    }, [dispatch])

    const login = async () => {
        dispatch(loginUser(username, password))
        setUsername('')
        setPassword('')
    }

    const logout = () => {
        dispatch(logoutUser())
        dispatch(clearBlogs())
    }

    return {
        user,
        login,
        logout,
        userForm: { username, setUsername, password, setPassword }
    }
}