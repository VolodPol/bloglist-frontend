import { useEffect, useState } from "react";


const Blog = ({ blog, onLike, isRemovable, onRemove }) => {
    const [show, setShow] = useState(false)

    const [likes, setLikes] = useState(blog.likes)
    const [title, setTitle] = useState(blog.title)
    const [author, setAuthor] = useState(blog.author)
    const [url, setUrl] = useState(blog.url)

    useEffect(() => {
        setTitle(blog.title)
        setAuthor(blog.author)
        setUrl(blog.url)
    }, [blog]);


    const likeBlog = async () => {
        onLike(blog.id)
        setLikes(likes + 1)
    }


    const detailsButton = () =>
        <button onClick={() => setShow(!show)}>
            {show ? 'hide' : 'view'}
        </button>

    return (
        <div className="blog">
            <span>{title} {author} {detailsButton()}</span>
            {
                show &&
                <div>
                    <div>{url}</div>
                    <div>
                        <span>{likes} <button onClick={ () => likeBlog() }>like</button></span>
                    </div>
                    { isRemovable && <button className={"remove-button"} onClick={() => onRemove(blog)}>remove</button> }
                </div>
            }
        </div>
    )
}

export default Blog