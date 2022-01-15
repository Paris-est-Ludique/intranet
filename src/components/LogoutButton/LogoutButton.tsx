import React, { FC, memo, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { unsetJWT } from "../../services/auth"
import { isUserConnected, logoutUser } from "../../store/auth"
import styles from "./styles.module.scss"

const LogoutButton: FC = (): JSX.Element | null => {
    const dispatch = useDispatch()
    const connected = useSelector(isUserConnected)

    const onClick = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            unsetJWT()
            dispatch(logoutUser())
        },
        [dispatch]
    )

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
