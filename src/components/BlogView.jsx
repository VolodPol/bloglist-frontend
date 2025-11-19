import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { notify } from '../reducers/notificationReducer.js'
import { addComment } from '../reducers/blogReducer.js'
import { useSaveCommentMutation } from '../services/api/blogApi.js'

export const BlogView = ({ blogs, createdByUser, onLike, onRemove }) => {
    const blogMatch = useMatch('/blogs/:id')
    const selectedBlog = blogMatch ? blogs.find(b => b.id === blogMatch.params.id) : null

    const [likes, setLikes] = useState(null)

    const dispatch = useDispatch()
    const [saveComment] = useSaveCommentMutation()

    useEffect(() => {
        if (selectedBlog)
            setLikes(selectedBlog.likes)
    }, [selectedBlog])

    if (!selectedBlog) return null

    const likeBlog = async () => {
        onLike(selectedBlog.id)
        setLikes(likes + 1)
    }

    const provideComment = async (event) => {
        event.preventDefault()
        const { target } = event
        const { comment: { value: content } } = target
        if (!content) {
            dispatch(notify('Comment cannot be empty!'))
            return
        }
        const { data: newComment } = await saveComment({ blogId: selectedBlog.id, newComment: { content } })
        dispatch(addComment({ blogId: selectedBlog.id, comment: newComment }))
    }

    const commentsSection = () => {
        return (
            <div>
                <h3>
                    comments
                </h3>
                <form onSubmit={provideComment}>
                    <input name={'comment'} type={'text'} />
                    <button type={'submit'}> add comment</button>
                </form>
                <ul>
                    { selectedBlog.comments.map(c => <li key={c.content}>{c.content}</li>) }
                </ul>
            </div>
        )
    }

    return (
        <div>
            <h2>{selectedBlog.title} {selectedBlog.author}</h2>
            <div>
                <div>
                    <a href={selectedBlog.url}>{selectedBlog.url}</a>
                </div>
                <div>
                    <span>
                        {likes} <button onClick={() => likeBlog()}>like</button>
                    </span>
                </div>
                <div>
                    Added by { selectedBlog.user.name }
                </div>
                { commentsSection() }
                {createdByUser.has(selectedBlog.id) && (
                    <button className={'remove-button'} onClick={() => onRemove(selectedBlog)}>
                        remove
                    </button>
                )}
            </div>
        </div>
    )
}
