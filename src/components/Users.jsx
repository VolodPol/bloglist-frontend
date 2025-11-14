import { useFetchUsersQuery } from '../services/api/userApi.js'
import { Link } from 'react-router-dom'

export const Users = () => {
    const { data: users = [], isSuccess } = useFetchUsersQuery()

    function Row ({ userInfo }) {
        return(
            <tr>
                <td>{ <Link to={`/users/${userInfo.id}`}>{ userInfo.username }</Link> }</td>
                <td>{ userInfo.blogs.length }</td>
            </tr>
        )
    }

    function provideStatistics() {
        return users
            .map((u) => (<Row key={u.username} userInfo={u}/>))
    }

    function UserSection() {
        return (
            <div>
                <h2>Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th><b>blogs created</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        { isSuccess && provideStatistics() }
                    </tbody>
                </table>
            </div>
        )
    }

    return <UserSection/>
}