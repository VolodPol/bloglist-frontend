import { useFetchUsersQuery } from '../services/api/userApi.js'
import { useMatch } from 'react-router-dom'

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
        return user.blogs.map(b =>
            <li key={b.id}>
                { b.title }
            </li>
        )
    }

    return (
        <div>
            <h2>{ user.name }</h2>
            <h3>added blogs</h3>
            <ul>{ blogsList() }</ul>
        </div>
    )
}
