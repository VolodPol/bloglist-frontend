import { useState } from "react";
import blogService from '../services/blogs'


const NewBlogForm = ({ setError }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')


    const handleBlogCreation = async event => {
        event.preventDefault()

        if (title && author && url) {
            await blogService.create({
                title, author, url
            })
        } else {
            setError('All fields are mandatory!')
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleBlogCreation}>
                <div>
                    <label>
                        title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)}/>
                    </label>
                </div>

                <div>
                    <label>
                        author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}/>
                    </label>
                </div>

                <div>
                    <label>
                        url: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)}/>
                    </label>
                </div>

                <button type="submit">create</button>
            </form>
        </div>
    )
}


export default NewBlogForm