import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog.jsx'


test('renders content', () => {
    const blog = {
        title: 'Lorem Ipsum',
        author: 'Antony Ferguson',
        url: 'http://localhost:8080',
        likes: 10,
        user: {
            username: 'jodo',
            name: 'John Doe',
            id: 'id'
        }
    }

    const mockFunction = () => {}
    render(<Blog blog={blog} onLike={mockFunction} isRemovable={false} onRemove={mockFunction} />)

    const element = screen.getByTestId('title')
    expect(element).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(blog.likes)).toBeNull()
})