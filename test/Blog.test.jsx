import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog.jsx'


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
let mockFunction

beforeEach(() => {
    mockFunction = vi.fn()
})

test('renders content', () => {
    render(<Blog blog={blog} onLike={mockFunction} isRemovable={false} onRemove={mockFunction} />)

    const element = screen.getByTestId('title')
    expect(element).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(blog.likes)).toBeNull()
})

test('blog url & likes visible on click', async () => {
    render(<Blog blog={blog} onLike={mockFunction} isRemovable={false} onRemove={mockFunction}  />)
    const user = userEvent.setup()

    const showDetailsBtn = screen.getByText('view', { exact: false })
    await user.click(showDetailsBtn)

    expect(screen.getByTestId('url')).toHaveTextContent(blog.url)
    expect(screen.getByTestId('likes')).toHaveTextContent(blog.likes)
})

test('verify likes button behaviour', async () => {
    render(<Blog blog={blog} onLike={mockFunction} isRemovable={false} onRemove={mockFunction}  />)

    const user = userEvent.setup()
    const viewDetailsBtn = screen.getByText('view')
    await user.click(viewDetailsBtn)

    const likeBtn = screen.getByText('like', { exact: false })
    await user.click(likeBtn)
    await user.click(likeBtn)

    expect(mockFunction.mock.calls).toHaveLength(2)
    screen.getByText(`${blog.likes + 2}`)
})