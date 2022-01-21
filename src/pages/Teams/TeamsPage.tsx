import { FC, useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk, EntitiesRequest } from "../../store"
import { Team } from "../../services/teams"
import { fetchTeamListIfNeed } from "../../store/teamList"
import styles from "./styles.module.scss"
import TeamList from "../../components/Teams/TeamList"
import TeamIntro from "../../components/Teams/TeamIntro"

export type Props = RouteComponentProps

function useList(
    stateToProp: (state: AppState) => EntitiesRequest<Team>,
    fetchDataIfNeed: () => AppThunk
) {
    const dispatch = useDispatch()
    const { ids, entities, readyStatus } = useSelector(stateToProp, shallowEqual)

    // Fetch client-side data here
    useEffect(() => {
        dispatch(fetchDataIfNeed())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    return () => {
        if (!readyStatus || readyStatus === "idle" || readyStatus === "request")
            return <p>Loading...</p>

        if (readyStatus === "failure") return <p>Oops, Failed to load!</p>

        return ids.map((id) => {
            const team = entities[id]
            return team === undefined ? null : (
                <div key={id}>
                    <b>{team.name}</b>:{team.description}
                    <br />
                    Avant: {team.before}
                    <br />
                    Pendant: {team.during}
                    <br />
                    Après: {team.after}
                    <br />
                    <br />
                </div>
            )
        })
    }
}

const TeamsPage: FC<Props> = (): JSX.Element => (
    <div className={styles.teamsPage}>
        <div className={styles.teamsContent}>
            <Helmet title="TeamsPage" />
            <TeamIntro />
            <TeamList />
            <hr />
            {useList((state: AppState) => state.teamList, fetchTeamListIfNeed)()}
        </div>
    </div>
)

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchTeamListIfNeed()]

export default memo(TeamsPage)
