import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../store"
import { fetchVolunteerDayWishesSetIfNeed } from "../../store/volunteerDayWishesSet"
import { selectUserJwtToken } from "../../store/auth"
import DayWishes from "../../components/VolunteerBoard/DayWishes/DayWishes"
import DDayInformations from "../../components/VolunteerBoard/DDayInformations/DDaysInformations"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

const HomePage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <div className={styles.dayWishPage}>
                <div className={styles.dayWisContent}>
                    <DayWishes />
                    <DDayInformations />
                </div>
            </div>
        )
    }
    return <div>Besoin d&apos;être identifié</div>
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchVolunteerDayWishesSetIfNeed()]

export default memo(HomePage)
