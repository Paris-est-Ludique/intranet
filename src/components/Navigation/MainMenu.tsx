import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { isUserConnected, routerSelector, selectUserId, selectUserRoles } from '@/store/auth'
import ROLES from '@/utils/roles.constants'
import useAction from '@/utils/useAction'
import { fetchVolunteerListIfNeed, selectVolunteerList } from '@/store/volunteerList'

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
  return roles.includes(role) ? <MenuItem name={name} pathname={pathname} /> : <></>
}

interface TeamMenuItemProps extends MenuItemProps {
  team: number
}

const TeamMenuItem: FC<TeamMenuItemProps> = ({ name, pathname, team }): JSX.Element => {
  const fetch = useAction(fetchVolunteerListIfNeed)
  const userId = useSelector(selectUserId)
  useEffect(() => {
    if (userId)
      fetch()
  }, [userId, fetch])
  const volunteers = useSelector(selectVolunteerList)
  const user = useMemo(
    () => volunteers.find(volunteer => volunteer.id === userId),
    [volunteers, userId],
  )
  return user?.team === team ? <MenuItem name={name} pathname={pathname} /> : <></>
}

// Hardcoded value of the "Jeux à volonté" team
const TEAM_JAV = 2

const MainMenu: FC = (): JSX.Element => {
  const connected = useSelector(isUserConnected)
  const [opened, setOpened] = useState(false)

  const onOpen = useCallback(() => {
    setOpened(true)
  }, [setOpened])

  const onClose = useCallback(() => {
    setOpened(false)
  }, [setOpened])

  if (!connected)
    return <div />

  return (
    <nav>
      <button type="button" className={styles.burger} onClick={onOpen}>
        ☰
      </button>
      <ul className={classnames(styles.mainMenu, opened && styles.opened)}>
        <MenuItem name="Questions" pathname="/" />
        <MenuItem name="Annonces" pathname="/annonces" />
        <MenuItem name="Mon profil" pathname="/profil" />
        {/* <MenuItem name="Emprunter" pathname="/emprunter" />
                <MenuItem name="Emprunts" pathname="/emprunts" /> */}
        <TeamMenuItem team={TEAM_JAV} name="Mes connaissances" pathname="/connaissances" />
        <TeamMenuItem team={TEAM_JAV} name="Stats" pathname="/stats" />
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

// export const fetchForMainMenu = [
//     ...fetchForTeamWishesForm,
// ]
