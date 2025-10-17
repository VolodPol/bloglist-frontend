import { useState } from 'react'


const NewBlogForm = ({ onCreate, notify }) => {
    const [titleField, setTitleField] = useState('')
    const [authorField, setAuthorField] = useState('')
    const [urlField, setUrlField] = useState('')


    const reset = () => {
        setTitleField('')
        setAuthorField('')
        setUrlField('')
    }

    const handleBlogCreation = async event => {
        event.preventDefault()

        if (titleField && authorField && urlField) {
            onCreate({ title: titleField, author: authorField, url: urlField })
            reset()
            notify({ status: true, message: `A new blog: ${titleField} by ${authorField} added` })
        } else {
            notify({ message: 'All fields are mandatory!' })
        }
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleBlogCreation}>
                <div>
                    <label>
                        title: <input type="text" value={titleField} onChange={({ target }) => setTitleField(target.value)}/>
                    </label>
                </div>

                <div>
                    <label>
                        author: <input type="text" value={authorField} onChange={({ target }) => setAuthorField(target.value)}/>
                    </label>
                </div>

                <div>
                    <label>
                        url: <input type="text" value={urlField} onChange={({ target }) => setUrlField(target.value)}/>
                    </label>
                </div>

                <button type="submit">create</button>
            </form>
        </div>
    )
}


export default NewBlogForm