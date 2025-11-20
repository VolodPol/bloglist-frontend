import { Box, Typography, TextField, Button } from '@mui/material'

const Login = ({ handleLogin, username, setUsername, password, setPassword }) => {
    return (
        <div>
            <Typography variant='h4'>Log in to application</Typography>
            <Box
                component='form'
                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                autoComplete='off'
                onSubmit={handleLogin}
            >
                <div>
                    <TextField
                        label={'Username'}
                        type='text'
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        required
                    />
                </div>
                <div>

                    <TextField
                        label={'Password'}
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        required
                    />
                </div>
                <Button variant='contained' type='submit' sx={{ mt: 2 }}>login</Button>
            </Box>

        </div>
    )
}

export default Login
