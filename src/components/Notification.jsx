const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    let className = 'message'

    const { status, message } = notification;
    !status && (className += ' error')

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification;