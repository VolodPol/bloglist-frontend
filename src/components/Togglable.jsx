import { useState, useImperativeHandle } from 'react'
import { Button } from '@mui/material'

const Togglable = ({ children, buttonLabel, ref }) => {
    const [isVisible, setIsVisible] = useState(false)

    useImperativeHandle(ref, () => ({ setIsVisible }))

    const show = { display: isVisible ? '' : 'none' }
    const style = {
        margin: '10px 0px',
        backgroundColor: isVisible ? 'red' : 'green'
    }

    return (
        <div>
            <div style={show}>{children}</div>
            <Button variant='contained' sx={style} onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? 'cancel' : buttonLabel}
            </Button>
        </div>
    )
}

export default Togglable
