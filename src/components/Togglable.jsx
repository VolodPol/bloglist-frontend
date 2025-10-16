import { useState, useImperativeHandle } from "react";

export const Togglable = ({ children, buttonLabel, ref }) => {
    const [isVisible, setIsVisible] = useState(false)

    useImperativeHandle(ref, () => (
        { setIsVisible }
    ))


    const show = { display: isVisible ? '' : 'none' }
    return (
        <div>
            <div style={show}>
                { children }
            </div>
            <button onClick={() => setIsVisible(!isVisible)}>
                { isVisible ? 'cancel' : buttonLabel }
            </button>
        </div>
    )
}