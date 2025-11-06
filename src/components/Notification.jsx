import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => state.notification)

    if (notification === null) {
        return null
    }

    let className = 'message'

    const { status, message } = notification
    !status && (className += ' error')

    return <div className={className}>{message}</div>
}

export default Notification
