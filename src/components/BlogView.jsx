import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { notify } from '../reducers/notificationReducer.js'
import { addComment } from '../reducers/blogReducer.js'
import { useSaveCommentMutation } from '../services/api/blogApi.js'
import {
    Box,
    Typography,
    Button,
    TextField,
    Link,
    List,
    ListItem,
    ListItemText,
    Divider,
    Stack,
    Paper
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

export const BlogView = ({ blogs, createdByUser, onLike, onRemove }) => {
    const blogMatch = useMatch('/blogs/:id')
    const selectedBlog = blogMatch ? blogs.find(b => b.id === blogMatch.params.id) : null

    const [likes, setLikes] = useState(null)

    const dispatch = useDispatch()
    const [saveComment] = useSaveCommentMutation()

    useEffect(() => {
        if (selectedBlog)
            setLikes(selectedBlog.likes)
    }, [selectedBlog])

    if (!selectedBlog) return null

    const likeBlog = async () => {
        onLike(selectedBlog.id)
        setLikes(likes + 1)
    }

    const provideComment = async (event) => {
        event.preventDefault()
        const { target } = event
        const { comment: { value: content } } = target
        if (!content) {
            dispatch(notify('Comment cannot be empty!'))
            return
        }
        const { data: newComment } = await saveComment({ blogId: selectedBlog.id, newComment: { content } })
        dispatch(addComment({ blogId: selectedBlog.id, comment: newComment }))
    }

    const CommentsSection = () => (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Comments
            </Typography>

            <List dense>
                {selectedBlog.comments.map((c, index) => (
                    <ListItem key={index} disableGutters divider>
                        <ListItemText primary={c.content} />
                    </ListItem>
                ))}
                {selectedBlog.comments.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No comments yet. Be the first!
                    </Typography>
                )}
            </List>

            <Box component="form" onSubmit={provideComment} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <TextField
                    name="comment"
                    label="Write a comment..."
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                >
                    Add
                </Button>
            </Box>
        </Box>
    )

    return (
        <Paper elevation={0} sx={{ p: 2 }}>

            <Typography variant="h4" component="h2" gutterBottom>
                {selectedBlog.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                by {selectedBlog.author}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Link href={selectedBlog.url} target="_blank" rel="noopener">
                    {selectedBlog.url}
                </Link>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>

                <Button
                    onClick={() => likeBlog()}
                    variant="outlined"
                    startIcon={<ThumbUpIcon />}
                    size="small"
                >
                    {likes} Likes
                </Button>

                {createdByUser.has(selectedBlog.id) && (
                    <Button
                        onClick={() => onRemove(selectedBlog)}
                        color="error"
                        variant="text"
                        startIcon={<DeleteIcon />}
                        size="small"
                    >
                        Remove
                    </Button>
                )}
            </Stack>

            <Typography variant="caption" display="block" color="text.secondary">
                Added by {selectedBlog.user.name}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <CommentsSection />

        </Paper>
    )
}
