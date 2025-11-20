import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
    const notification = useSelector(state => state.notification)

    if (notification === null) {
        return null
    }

    const { status, message } = notification

    return <Alert
        severity={status ? 'success' : 'error'}
        sx={{
            fontSize: '20px',
            border: '1px solid',
            borderRadius: '5px',
            p: '10px',
            mb: '10px',
            alignItems: 'center',
        }}
    >
        {message}
    </Alert>
}

export default Notification
