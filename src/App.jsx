import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
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


    const handleLogin = (event) => {
        try {
            event.preventDefault()
            const loggedIn = blogService.login({ username, password })
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
        { user && blogsSection() }
    </div>
}

export default App