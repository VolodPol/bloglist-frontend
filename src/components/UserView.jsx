import { useFetchUsersQuery } from '../services/api/userApi.js'
import { useMatch } from 'react-router-dom'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText
} from '@mui/material'

export const UserView = () => {
    const userMatch = useMatch('/users/:id')
    const userExtractor = (users) => {
        return userMatch ? users.find(u => u.id === userMatch.params.id) : null
    }

    const { user } = useFetchUsersQuery(undefined, {
        'selectFromResult': ({ data = [], isSuccess }) => ({
            user: isSuccess ? userExtractor(data) : null
        })
    })

    if (!user)
        return null

    function blogsList() {
        return user.blogs.map(b => (
            <ListItem
                key={b.id}
                sx={{ display: 'list-item' }}
            >
                <ListItemText primary={b.title} />
            </ListItem>
        ))
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {user.name}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                added blogs
            </Typography>

            <List sx={{ listStyleType: 'disc', pl: 4 }}>
                {blogsList()}
            </List>
        </Box>
    )
}
