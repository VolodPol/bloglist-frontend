import { useState } from "react";

const Blog = ({blog}) => {
    const { title, author, url, likes } = blog
    const [show, setShow] = useState(false)

    const button = () =>
        <button onClick={() => setShow(!show)}>
            {show ? 'hide' : 'view'}
        </button>

    return (
        <div className="blog">
            <span>{title} {button()}</span>
            {
                show &&
                <div>
                    <div>{url}</div>
                    <div><span>{likes} <button>like</button></span></div>
                    <div><span>{author}</span></div>
                </div>
            }
        </div>
    )
}

export default Blog