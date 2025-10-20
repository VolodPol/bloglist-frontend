import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import NewBlogForm from '../src/components/NewBlogForm.jsx'

test('Blog form updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const mockOnCreate = vi.fn()
    const mockNotify = vi.fn()

    render(<NewBlogForm onCreate={mockOnCreate} notify={mockNotify}  />)

    const titleField = screen.getByLabelText('title:')
    const authorField = screen.getByLabelText('author:')
    const urlField = screen.getByLabelText('url:')

    const sendButton = screen.getByText('create')

    const expected = {
        title: 'Lorem Ipsum',
        author: 'Author',
        url: 'http://localhost:8090'
    }

    await user.type(titleField, expected.title)
    await user.type(authorField, expected.author)
    await user.type(urlField, expected.url)
    await user.click(sendButton)

    expect(mockOnCreate.mock.calls).toHaveLength(1)
    expect(mockNotify.mock.calls).toHaveLength(1)
    const actualContent = mockOnCreate.mock.calls[0][0]

    expect(actualContent.title).toBe(expected.title)
    expect(actualContent.author).toBe(expected.author)
    expect(actualContent.url).toBe(expected.url)
})