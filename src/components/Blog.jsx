import { Link } from 'react-router-dom'

export const Blog = ({ blog }) => {
    return (
        <div className='blog'>
            <span>
                <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                </Link>
            </span>
        </div>
    )
}