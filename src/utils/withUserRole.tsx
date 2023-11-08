import type React from 'react'
import { useSelector } from 'react-redux'
import { selectUserRoles } from '@/store/auth'

export default function withUserRole<T extends JSX.IntrinsicAttributes>(
  requiredRole: string,
  Component: React.ComponentType<T>,
  doShowMissingRole: true | null = true,
) {
  return function isWithUserRole(props: T): JSX.Element | null {
    const roles = useSelector(selectUserRoles)

    return roles.includes(requiredRole)
      ? (
        <Component {...props} />
        )
      : (
          doShowMissingRole && (
            <div>
              Missing role
              {requiredRole}
            </div>
          )
        )
  }
}
