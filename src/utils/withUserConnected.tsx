import React from "react"
import { useSelector } from "react-redux"
import { isUserConnected } from "../store/auth"

function withUserConnected<T extends JSX.IntrinsicAttributes>(Component: React.ComponentType<T>) {
    return (props: T): JSX.Element | null => {
        const connected = useSelector(isUserConnected)
        return connected ? <Component {...props} /> : null
    }
}

export default withUserConnected
