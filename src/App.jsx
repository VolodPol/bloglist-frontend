import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login.js'
import Login from "./components/Login.jsx";
import NewBlogForm from "./components/NewBlogForm.jsx";
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
        { !user && <Login
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}/> }
        { user && (
            <div>
                <div>{user.name} logged in </div>
                <form onSubmit={handleLogout}><button type="submit">Logout</button></form>
                <NewBlogForm setError={setError}/>
                { blogsSection() }
            </div>
        ) }
    </div>
}

export default App