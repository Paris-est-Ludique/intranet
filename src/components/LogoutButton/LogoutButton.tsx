import React, { FC, memo, useCallback } from "react"
import { useSelector } from "react-redux"
import { unsetJWT } from "../../services/auth"
import { isUserConnected } from "../../store/auth"
import styles from "./styles.module.scss"

const LogoutButton: FC = (): JSX.Element | null => {
    const connected = useSelector(isUserConnected)

    const onClick = useCallback((event: React.SyntheticEvent): boolean => {
        event.preventDefault()
        unsetJWT()
        // eslint-disable-next-line no-restricted-globals
        location?.reload()
        return false
    }, [])

    if (!connected) return null

    return (
        <div key="logout" className={styles.logoutButton}>
            <button type="button" onClick={onClick}>
                Se déconnecter
            </button>
        </div>
    )
}

export default memo(LogoutButton)
