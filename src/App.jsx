import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login.js'
import Error from "./components/Error.jsx";
import "../index.css"


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedInUser')
        if (loggedUserJSON) {
            const resolvedUser = JSON.parse(loggedUserJSON)
            setUser(resolvedUser)
            blogService.setToken(resolvedUser.token)
        }
    }, [])


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
            setError('wrong credentials')
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }

    const handleLogout = () => {
        window.localStorage.clear()
    }

    const loginSection = () =>
        (
            <>
                <h2>Log in to application</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label> username
                            <input type="text" value={username}
                                   onChange={({ target }) => setUsername(target.value)}/>
                        </label>
                    </div>
                    <div>
                        <label> password
                            <input type="password" value={password}
                                   onChange={({ target }) => setPassword(target.value)}/>
                        </label>
                    </div>
                    <button type="submit">login</button>
                </form>
            </>
        )

    const blogsSection = () =>
        (
            <div>
                <h2>blogs</h2>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog}/>
                )}
            </div>
        )

    return <div>
        <Error notification={error}/>
        { !user && loginSection() }
        { user && (
            <div>
                <div>{user.name} logged in </div>
                <form onSubmit={handleLogout}><button type="submit">Logout</button></form>
                { blogsSection() }
            </div>
        ) }
    </div>
}

export default App