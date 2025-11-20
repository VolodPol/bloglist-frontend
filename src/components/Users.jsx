import { useFetchUsersQuery } from '../services/api/userApi.js'
import { Link } from 'react-router-dom'
import { TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

export const Users = () => {
    const { data: users = [], isSuccess } = useFetchUsersQuery()

    function Row ({ userInfo }) {
        return(
            <TableRow>
                <TableCell>{ <Link to={`/users/${userInfo.id}`}>{ userInfo.username }</Link> }</TableCell>
                <TableCell>{ userInfo.blogs.length }</TableCell>
            </TableRow>
        )
    }

    function provideStatistics() {
        return <TableBody>
            { users.map((u) => (<Row key={u.username} userInfo={u}/>)) }
        </TableBody>
    }

    function UserSection() {
        return (
            <div>
                <h2>Users</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell><b>blogs created</b></TableCell>
                            </TableRow>
                        </TableHead>
                        { isSuccess && provideStatistics() }
                    </Table>
                </TableContainer>
            </div>
        )
    }

    return <UserSection/>
}