import { FC, useCallback, useState } from "react"
import { useSelector } from "react-redux"
import classnames from "classnames"
import { isUserConnected, routerSelector } from "../../store/auth"
import styles from "./styles.module.scss"

const MainMenu: FC = (): JSX.Element | null => {
    const connected = useSelector(isUserConnected)
    const router = useSelector(routerSelector)

    const [opened, setOpened] = useState(false)

    const onOpen = useCallback(() => {
        setOpened(true)
    }, [setOpened])

    const onClose = useCallback(() => {
        setOpened(false)
    }, [setOpened])

    if (!connected) return null

    function createMenuItem(name: string, pathname: string): JSX.Element {
        const isActive = (router as any)?.location?.pathname === pathname
        return (
            <li className={classnames(styles.mainMenuItem, isActive ? styles.active : null)}>
                <a href={pathname}>{name}</a>
            </li>
        )
    }

    return (
        <nav>
            <button type="button" className={styles.burger} onClick={onOpen}>
                ☰
            </button>
            <ul className={classnames(styles.mainMenu, opened && styles.opened)}>
                {createMenuItem("Questions", "/")}
                {createMenuItem("Annonces", "/annonces")}
                createMenuItem("Mon profil", "/profil")
                <button type="button" className={styles.close} onClick={onClose}>
                    ×
                </button>
            </ul>
        </nav>
    )
}

export default MainMenu

// // Fetch server-side data here
// export const fetchFor = [
//     ...fetchForTeamWishesForm,
// ]
