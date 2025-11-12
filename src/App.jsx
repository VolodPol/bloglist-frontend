import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notify } from './reducers/notificationReducer.js'
import { addBlog, setBlogs, fetchBlogs, removeBlog, clearBlogs } from './reducers/blogReducer.js'
import Blog from './components/Blog'
import Login from './components/Login.jsx'
import Togglable from './components/Togglable.jsx'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import {
    useCreateBlogMutation,
    useLazyGetBlogsQuery,
    useUpdateBlogMutation,
} from './services/api/blogApi.js'
import { loginUser, logoutUser, readUser } from './reducers/authenticationReducer.js'
import '../index.css'

const App = () => {
    const user = useSelector(state => state.authentication.user)
    const blogs = useSelector(state => state.blogs)
    const [updateBlog] = useUpdateBlogMutation()
    const [createBlog] = useCreateBlogMutation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [createdByUser, setCreatedByUser] = useState(() => new Set())
    const blogFormRef = useRef(null)

    const dispatch = useDispatch()

    const [ getBlogs ] = useLazyGetBlogsQuery()

    useEffect(() => {
        if (user) {
            getBlogs().then((result) => {
                if (result?.data)
                    dispatch(setBlogs(result.data))
            })
        }
    }, [dispatch, getBlogs, user])

    useEffect(() => {
        dispatch(readUser())
    }, [dispatch])

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
            dispatch(loginUser(username, password))
            setUsername('')
            setPassword('')
        } catch { dispatch(notify('Wrong credentials')) }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        dispatch(logoutUser())
        dispatch(clearBlogs())
        setCreatedByUser(new Set())
    }

    const onCreate = async (newBlog) => {
        blogFormRef.current.setIsVisible(false)
        const { data: created } = await createBlog(newBlog)
        const updated = {
            ...created,
            user: {
                username: user.username,
                name: user.name,
                id: user['userId'],
            }
        }
        dispatch(addBlog(updated))
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
