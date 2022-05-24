import React from "react"
import { useSelector } from "react-redux"
import { selectUserRoles } from "../store/auth"

function withUserRole<T>(requiredRole: string, Component: React.ComponentType<T>) {
    return (props: T): JSX.Element => {
        const roles = useSelector(selectUserRoles)
        return roles.includes(requiredRole) ? (
            <Component {...props} />
        ) : (
            <div>Missing role {requiredRole}</div>
        )
    }
}

export default withUserRole
