import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { notify } from './reducers/notificationReducer.js'
import { addBlog, setBlogs, deleteBlog } from './reducers/blogReducer.js'
import Login from './components/Login.jsx'
import Togglable from './components/Togglable.jsx'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import {
    useCreateBlogMutation,
    useLazyGetBlogsQuery,
    useRemoveBlogMutation,
    useUpdateBlogMutation,
} from './services/api/blogApi.js'
import '../index.css'
import { useUser } from './hooks/useUser.js'
import { Users } from './components/Users.jsx'
import { UserView } from './components/UserView.jsx'
import { BlogView } from './components/BlogView.jsx'
import { Blog } from './components/Blog.jsx'

const App = () => {
    const { user, login, logout, userForm } = useUser()

    const blogs = useSelector(state => state.blogs)
    const [getBlogs] = useLazyGetBlogsQuery()
    const [updateBlog] = useUpdateBlogMutation()
    const [createBlog] = useCreateBlogMutation()
    const [removeBlog] = useRemoveBlogMutation()

    const [createdByUser, setCreatedByUser] = useState(() => new Set())
    const blogFormRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            getBlogs().then((result) => {
                if (result?.data)
                    dispatch(setBlogs(result.data))
            })
        }
    }, [dispatch, getBlogs, user])

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
            await login()
        } catch { dispatch(notify('Wrong credentials')) }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        logout()
        setCreatedByUser(new Set())
        navigate('/')
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
        const { data: sorted } = await getBlogs()
        dispatch(setBlogs(sorted))
    }

    const onRemove = async (blog) => {
        const { id, title, author } = blog
        if (window.confirm(`Remove blog ${title} by ${author} ?`)) {
            dispatch(deleteBlog(id))
            await removeBlog(id)
            navigate('/')
        }
    }

    const blogsSection = () => (
        <div>
            {blogs.map((blog) => <Blog key={blog.id} blog={blog}/>)}
        </div>
    )

    return (
        <div>
            <Notification />
            {!user && (
                <Login handleLogin={ handleLogin } { ...userForm  } />
            )}
            {user && (
                <div>
                    <div>
                        <form onSubmit={handleLogout}>
                            <nav className={'menu'}>
                                <label>
                                    <Link to={'/'}>blogs</Link> <Link to={'/users'}>users</Link> {user.name} logged in <button type='submit'>Logout</button>
                                </label>
                            </nav>
                        </form>
                    </div>
                    <h2>blog app</h2>
                    <Routes>
                        <Route path={'/'} element={ <>
                            <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                                <NewBlogForm onCreate={onCreate} notify={notify} />
                            </Togglable>
                            { blogsSection() }
                        </>}/>

                        <Route path={'/users'} element={ <Users/> }/>
                        <Route path={'/users/:id'} element={ <UserView /> }/>
                        <Route path={'/blogs/:id'} element={
                            <BlogView
                                blogs={blogs}
                                onLike={onLike}
                                createdByUser={createdByUser}
                                onRemove={onRemove}
                            />
                        }/>

                    </Routes>
                </div>
            )}
        </div>
    )
}

export default App
