import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login.js'
import Login from './components/Login.jsx'
import Togglable from './components/Togglable.jsx'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import '../index.css'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)

    const [createdByUser, setCreatedByUser] = useState(() => new Set())

    const blogFormRef = useRef(null)

    useEffect(() => {
        (async () => setBlogs((await blogService.getAll()))) ()
    }, [user])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedInUser')
        if (loggedUserJSON) {
            const resolvedUser = JSON.parse(loggedUserJSON)
            setUser(resolvedUser)
            blogService.setToken(resolvedUser.token)
        }
    }, [])

    useEffect(() => {
        if (blogs && user) {
            console.log('username: ', user.username)
            console.log(blogs)
            setCreatedByUser(new Set(
                blogs
                    .filter(it => it.user.username === user.username)
                    .map(it => it.id)
            )
            )
        }
    }, [blogs, user])

    const notify = (notification, timeout = 5000) => {
        setNotification(notification)
        setTimeout(() => setNotification(null), timeout)
    }


    const handleLogin = async event => {
        event.preventDefault()
        try {
            const loggedIn = await loginService.login({ username, password })
            console.log('loggedIn: ', loggedIn)
            window.localStorage.setItem('loggedInUser', JSON.stringify(loggedIn))
            blogService.setToken(loggedIn.token)
            setUser(loggedIn)
            setUsername('')
            setPassword('')
        } catch {
            notify({ message: 'Wrong credentials' })
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.clear()
        setUser(null)
        setBlogs([])
        setCreatedByUser(new Set())
    }

    const onCreate = async (newBlog) => {
        blogFormRef.current.setIsVisible(false)
        const created = await blogService.create(newBlog)
        created.user = {
            username: user.username,
            name: user.name,
            id: user['userId']
        }
        setBlogs(blogs.concat(created))
    }

    const onLike = async id => {
        const position = blogs.findIndex(it => it.id === id)
        const requested = blogs[position]
        requested.likes += 1
        const updatedBlogs = blogs
        updatedBlogs[position] = await blogService.update(requested)
        setBlogs(updatedBlogs.toSorted(sorter))
    }

    const onRemove = async blog => {
        const { id, title, author } = blog
        if (window.confirm(`Remove blog ${title} by ${author} ?`)) {
            await blogService.remove(id)
            setBlogs(blogs.filter(it => it.id !== id))
        }
    }

    const sorter = (a, b) => b.likes - a.likes

    const blogsSection = () =>
        (
            <div>
                {
                    blogs
                        .toSorted(sorter)
                        .map(blog =>
                            <Blog key={ blog.id }
                                blog={ blog }
                                onLike={ onLike }
                                isRemovable={ createdByUser.has(blog.id) }
                                onRemove={onRemove}
                            />
                        )
                }
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

                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                    <NewBlogForm onCreate={onCreate} notify={notify}/>
                </Togglable>
                { blogsSection() }
            </div>
        ) }
    </div>
}

export default App