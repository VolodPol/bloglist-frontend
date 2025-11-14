import { useFetchUsersQuery } from '../services/api/userApi.js'

export const UsersSummary = () => {
    const { data: users = [], isSuccess } = useFetchUsersQuery()

    function provideStatistics() {
        return users
            .map((u) => (<Section key={u.username} userInfo={u}/>))
    }

    function Section ({ userInfo }) {
        return(
            <tr>
                <td>{ userInfo.username }</td>
                <td>{ userInfo.blogs.length }</td>
            </tr>
        )
    }

    return(
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