import { useState } from "react";

export const Togglable = ({ children, buttonLabel }) => {
    const [isVisible, setIsVisible] = useState(false)

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