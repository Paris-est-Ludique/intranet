import type React from 'react'
import { useSelector } from 'react-redux'

export default function withUserConnected<T extends JSX.IntrinsicAttributes>(Component: React.ComponentType<T>) {
  return function isConnected(props: T): JSX.Element | null {
    const connected = useSelector(isUserConnected)
    return connected ? <Component {...props} /> : null
  }
}
