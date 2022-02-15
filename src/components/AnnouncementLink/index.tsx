import { memo } from "react"
import { Announcement } from "../../services/announcement"
import styles from "./styles.module.scss"

interface Props {
    // eslint-disable-next-line react/require-default-props
    announcement: Announcement
}

const AnnouncementLink = ({ announcement }: Props): JSX.Element | null => {
    const { id, type, title, url } = announcement
    const icon = {
        gazette: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 20 20"
                className={styles.gazette}
            >
                <path
                    d="M16 2h4v15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V0h16v2zm0 2v13a1 1 0 0 0 1 1a1 1 0 0 0 1-1V4h-2zM2 2v15a1 1 0 0 0 1 1h11.17a2.98 2.98 0 0 1-.17-1V2H2zm2 8h8v2H4v-2zm0 4h8v2H4v-2zM4 4h8v4H4V4z"
                    fill="currentColor"
                />
            </svg>
        ),

        "compte rendu": (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="26"
                height="26"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 32 32"
                className={styles.report}
            >
                <path d="M10 18h8v2h-8z" fill="currentColor" />
                <path d="M10 13h12v2H10z" fill="currentColor" />
                <path d="M10 23h5v2h-5z" fill="currentColor" />
                <path
                    d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM12 4h8v4h-8zm13 24H7V7h3v3h12V7h3z"
                    fill="currentColor"
                />
            </svg>
        ),
    }[type]

    const typeName = {
        gazette: "Gazette - ",
        "compte rendu": "Compte rendu - ",
    }[type]

    return (
        <div key={id} className={styles.announcementLink}>
            {icon} {typeName}
            <a href={url}>{title}</a>
        </div>
    )
}

export default memo(AnnouncementLink)
