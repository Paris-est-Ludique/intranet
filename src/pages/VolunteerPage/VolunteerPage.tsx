import { useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk } from "../../store"
import { fetchVolunteerIfNeed } from "../../store/volunteer"
import { VolunteerInfo, VolunteerSet } from "../../components"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps<{ id: string }>

const VolunteerPage = ({ match }: Props): JSX.Element => {
    const { id: rawId } = match.params
    const id = +rawId
    const dispatch = useDispatch()
    const volunteer = useSelector((state: AppState) => state.volunteer, shallowEqual)

    useEffect(() => {
        dispatch(fetchVolunteerIfNeed(id))
    }, [dispatch, id])

    const renderInfo = () => {
        const volunteerInfo = volunteer

        if (!volunteerInfo || volunteerInfo.readyStatus === "request") return <p>Loading...</p>

        if (volunteerInfo.readyStatus === "failure" || !volunteerInfo.entity)
            return <p>Oops! Failed to load data.</p>

        return (
            <div>
                <VolunteerInfo item={volunteerInfo.entity} />
                <VolunteerSet dispatch={dispatch} volunteer={volunteerInfo.entity} />
            </div>
        )
    }

    return (
        <div className={styles.VolunteerPage}>
            <Helmet title="User Info" />
            {renderInfo()}
        </div>
    )
}

interface LoadDataArgs {
    params: { id: number }
}

export const loadData = ({ params }: LoadDataArgs): AppThunk[] => [fetchVolunteerIfNeed(params.id)]

export default memo(VolunteerPage)
