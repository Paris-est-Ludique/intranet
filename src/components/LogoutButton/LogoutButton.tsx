import type { FC } from 'react'
import type React from 'react'
import { memo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { unsetJWT } from '@/services/auth'
import { isUserConnected } from '@/store/auth'

const LogoutButton: FC = (): JSX.Element | null => {
  const connected = useSelector(isUserConnected)

  const onClick = useCallback((event: React.SyntheticEvent): boolean => {
    event.preventDefault()
    unsetJWT()

    location?.reload()
    return false
  }, [])

  if (!connected)
    return null

  return (
    <div key="logout" className={styles.logoutButton}>
      <button type="button" onClick={onClick}>
        Se déconnecter
      </button>
    </div>
  )
}

export default memo(LogoutButton)
