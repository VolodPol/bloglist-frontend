import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

export const BlogView = ({ blogs, createdByUser, onLike, onRemove }) => {
    const blogMatch = useMatch('/blogs/:id')
    const selectedBlog = blogMatch ? blogs.find(b => b.id === blogMatch.params.id) : null

    const [likes, setLikes] = useState(null)

    useEffect(() => {
        if (selectedBlog)
            setLikes(selectedBlog.likes)
    }, [selectedBlog])

    if (!selectedBlog) return null

    const likeBlog = async () => {
        onLike(selectedBlog.id)
        setLikes(likes + 1)
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
                {createdByUser.has(selectedBlog.id) && (
                    <button className={'remove-button'} onClick={() => onRemove(selectedBlog)}>
                        remove
                    </button>
                )}
            </div>
        </div>
    )
}
