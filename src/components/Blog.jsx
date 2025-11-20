import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, CardActionArea } from '@mui/material'

export const Blog = ({ blog }) => {
    return (
        <Card sx={{ maxWidth: 345, mb: 2 }}>
            <CardActionArea component={Link} to={`/blogs/${blog.id}`}>
                <CardContent>
                    <Typography gutterBottom variant='h6' component="div">
                        {blog.title}
                    </Typography>
                    <Typography variant='body2' color="text.secondary">
                        Written by {blog.author}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}