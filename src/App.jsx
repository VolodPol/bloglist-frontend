import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notify } from './reducers/notificationReducer.js'
import { addBlog, clearBlogs, fetchBlogs, removeBlog } from './reducers/blogReducer.js'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login.js'
import Login from './components/Login.jsx'
import Togglable from './components/Togglable.jsx'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import '../index.css'
import { useUpdateBlogMutation } from './services/api/blogApi.js'

const App = () => {
    const blogs = useSelector(state => state.blogs)
    const [updateBlog] = useUpdateBlogMutation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [createdByUser, setCreatedByUser] = useState(() => new Set())
    const blogFormRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if (user) dispatch(fetchBlogs())
    }, [dispatch, user])

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
            setCreatedByUser(
                new Set(
                    blogs.filter((it) => it.user.username === user.username).map((it) => it.id),
                ),
            )
        }
    }, [blogs, user])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const loggedIn = await loginService.login({ username, password })
            window.localStorage.setItem('loggedInUser', JSON.stringify(loggedIn))
            blogService.setToken(loggedIn.token)
            setUser(loggedIn)
            setUsername('')
            setPassword('')
        } catch { dispatch(notify('Wrong credentials')) }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.clear()
        setUser(null)
        dispatch(clearBlogs())
        setCreatedByUser(new Set())
    }

    const onCreate = async (newBlog) => {
        blogFormRef.current.setIsVisible(false)
        const created = await blogService.create(newBlog)
        created.user = {
            username: user.username,
            name: user.name,
            id: user['userId'],
        }
        dispatch(addBlog(created))
    }

    const onLike = async (id) => {
        const requested = blogs.find((it) => it.id === id.toString ())
        const updated = { ...requested, likes: (requested.likes || 0) + 1 }
        await updateBlog({ id: requested.id, updated })
        dispatch(fetchBlogs())
    }

    const onRemove = async (blog) => {
        const { id, title, author } = blog
        if (window.confirm(`Remove blog ${title} by ${author} ?`)) {
            dispatch(removeBlog(id))
        }
    }

    const blogsSection = () => (
        <div>
            {blogs.map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    onLike={onLike}
                    isRemovable={createdByUser.has(blog.id)}
                    onRemove={onRemove}
                />
            ))}
        </div>
    )

    return (
        <div>
            <Notification />
            {!user && (
                <Login
                    handleLogin={handleLogin}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                />
            )}
            {user && (
                <div>
                    <h2>blogs</h2>
                    <div>
                        <form onSubmit={handleLogout}>
                            <label>
                                {user.name} logged in <button type='submit'>Logout</button>
                            </label>
                        </form>
                    </div>
                    <br />

                    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                        <NewBlogForm onCreate={onCreate} notify={notify} />
                    </Togglable>
                    {blogsSection()}
                </div>
            )}
        </div>
    )
}

export default App
