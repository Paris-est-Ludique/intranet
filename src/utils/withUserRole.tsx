import React from "react"
import { useSelector } from "react-redux"
import { selectUserRoles } from "../store/auth"

function withUserRole<T>(
    requiredRole: string,
    Component: React.ComponentType<T>,
    doShowMissingRole: true | null = true
) {
    return (props: T): JSX.Element | null => {
        const roles = useSelector(selectUserRoles)
        return roles.includes(requiredRole) ? (
            <Component {...props} />
        ) : (
            doShowMissingRole && <div>Missing role {requiredRole}</div>
        )
    }
}

export default withUserRole
