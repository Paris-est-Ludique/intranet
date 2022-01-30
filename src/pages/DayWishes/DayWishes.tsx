import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../store"
import { fetchVolunteerDayWishesSetIfNeed } from "../../store/volunteerDayWishesSet"
import { selectUserJwtToken } from "../../store/auth"
import DayWishesForm from "../../components/VolunteerBoard/DayWishesForm/DayWishesForm"
import DDayInformations from "../../components/VolunteerBoard/ParticipationDetailsForm/ParticipationDetailsForm"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

const HomePage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <div className={styles.dayWishPage}>
                <div className={styles.dayWishContent}>
                    <DayWishesForm />
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
