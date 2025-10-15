import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login.js'
import Login from "./components/Login.jsx";
import NewBlogForm from "./components/NewBlogForm.jsx";
import Notification from "./components/Notification.jsx";
import "../index.css"
import {Togglable} from "./components/Togglable.jsx";


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        (async () => setBlogs(await blogService.getAll())) ()
        const loggedUserJSON = window.localStorage.getItem('loggedInUser')
        if (loggedUserJSON) {
            const resolvedUser = JSON.parse(loggedUserJSON)
            setUser(resolvedUser)
            blogService.setToken(resolvedUser.token)
        }
    }, [notification])

    const notify = (notification, timeout = 5000) => {
        setNotification(notification)
        setTimeout(() => setNotification(null), timeout)
    }


    const handleLogin = async event => {
        event.preventDefault()
        try {
            const loggedIn = await loginService.login({ username, password })
            window.localStorage.setItem('loggedInUser', JSON.stringify(loggedIn))
            blogService.setToken(loggedIn.token)
            setUser(loggedIn)
            setUsername('')
            setPassword('')
        } catch {
            notify({ message: 'Wrong credentials' })
        }
    }

    const handleLogout = () => {
        window.localStorage.clear()
    }

    const blogsSection = () =>
        (
            <div>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog}/>
                )}
            </div>
        )

    return <div>
        <Notification notification={notification}/>
        { !user && <Login
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}/> }
        { user && (
            <div>
                <h2>blogs</h2>
                <div>
                    <form onSubmit={handleLogout}>
                        <label>
                            {user.name} logged in <button type="submit">Logout</button>
                        </label>
                    </form>
                </div>
                <br/>

                <Togglable buttonLabel="create new blog">
                    <NewBlogForm notify={notify}/>
                </Togglable>
                { blogsSection() }
            </div>
        ) }
    </div>
}

export default App