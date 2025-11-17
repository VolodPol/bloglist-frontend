import { Link } from 'react-router-dom'

export const Blog = ({ blog }) => {
    return (
        <div key={blog.id} className='blog'>
            <span>
                <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                </Link>
            </span>
        </div>
    )
}