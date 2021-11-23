import { FC, useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk, EntitiesRequest } from "../../store"
import { fetchJeuJavListIfNeed } from "../../store/jeuJavList"
import { fetchEnvieListIfNeed } from "../../store/envieList"
import { JeuJavList, AddEnvie } from "../../components"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

function useList<Entity>(
    stateToProp: (state: AppState) => EntitiesRequest<Entity>,
    fetchDataIfNeed: () => AppThunk
) {
    const dispatch = useDispatch()
    const { readyStatus, ids } = useSelector(stateToProp, shallowEqual)

    // Fetch client-side data here
    useEffect(() => {
        dispatch(fetchDataIfNeed())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    return () => {
        if (!readyStatus || readyStatus === "idle" || readyStatus === "request")
            return <p>Loading...</p>

        if (readyStatus === "failure") return <p>Oops, Failed to load list!</p>

        return <JeuJavList ids={ids} />
    }
}

const Home: FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    return (
        <div className={styles.home}>
            <Helmet title="Home" />
            <AddEnvie dispatch={dispatch} />
            {/* {useList((state: AppState) => state.envieList, fetchEnvieListifNeed)()} */}
            {useList((state: AppState) => state.jeuJavList, fetchJeuJavListIfNeed)()}
            {/* <button type="button" onClick={() => setList([{id: 3, joueurs: 4, duree: 5, description: "abcd"}])}>
            Set list!
        </button> */}
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
    fetchEnvieListIfNeed(),
    fetchJeuJavListIfNeed(),
    // More pre-fetched actions...
]

export default memo(Home)
