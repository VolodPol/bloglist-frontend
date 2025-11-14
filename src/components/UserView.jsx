import { useFetchUsersQuery } from '../services/api/userApi.js'

export const UserView = ({ userExtractor }) => {
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
