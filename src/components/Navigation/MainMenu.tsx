import { FC, useCallback, useState } from "react"
import { useSelector } from "react-redux"
import classnames from "classnames"
import { isUserConnected, routerSelector, selectUserRoles } from "../../store/auth"
import styles from "./styles.module.scss"
import ROLES from "../../utils/roles.constants"

interface MenuItemProps {
    name: string
    pathname: string
}

const MenuItem: FC<MenuItemProps> = ({ name, pathname }): JSX.Element => {
    const router = useSelector(routerSelector)
    const isActive = (router as any)?.location?.pathname === pathname
    return (
        <li className={classnames(styles.mainMenuItem, isActive ? styles.active : null)}>
            <a href={pathname}>{name}</a>
        </li>
    )
}

interface RestrictMenuItemProps extends MenuItemProps {
    role: string
}

const RestrictMenuItem: FC<RestrictMenuItemProps> = ({ name, pathname, role }): JSX.Element => {
    const roles = useSelector(selectUserRoles)
    return roles.includes(role) ? <MenuItem name={name} pathname={pathname} /> : <div />
}

const MainMenu: FC = (): JSX.Element => {
    const connected = useSelector(isUserConnected)
    const [opened, setOpened] = useState(false)

    const onOpen = useCallback(() => {
        setOpened(true)
    }, [setOpened])

    const onClose = useCallback(() => {
        setOpened(false)
    }, [setOpened])

    if (!connected) return <div />

    return (
        <nav>
            <button type="button" className={styles.burger} onClick={onOpen}>
                ☰
            </button>
            <ul className={classnames(styles.mainMenu, opened && styles.opened)}>
                <MenuItem name="Questions" pathname="/" />
                <MenuItem name="Annonces" pathname="/annonces" />
                <MenuItem name="Mon profil" pathname="/profil" />
                {/* <MenuItem name="Mes connaissances" pathname="/connaissances" /> */}
                <RestrictMenuItem
                    role={ROLES.ASSIGNER}
                    name="Gestion équipes"
                    pathname="/team-assign"
                />
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
