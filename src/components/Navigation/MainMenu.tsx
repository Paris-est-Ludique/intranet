import { FC } from "react"
import { useSelector } from "react-redux"
import { isUserConnected } from "../../store/auth"
import styles from "./styles.module.scss"

const MainMenu: FC = (): JSX.Element | null => {
    const connected = useSelector(isUserConnected)

    if (!connected) return null

    return (
        <nav>
            <ul className={styles.mainMenu}>
                <li className={styles.mainMenuItem}>
                    <a href="/">Mon espace</a>
                </li>
                <li className={styles.mainMenuItem}>
                    <a href="/teams">Equipes</a>
                </li>
            </ul>
        </nav>
    )
}

export default MainMenu
