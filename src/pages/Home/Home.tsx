import { FC, useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk } from "../../store"
import { fetchJavGameListIfNeed } from "../../store/javGameList"
import { JavGameList } from "../../components"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

function useList(stateToProp: (state: AppState) => any, fetchDataIfNeed: () => AppThunk) {
    const dispatch = useDispatch()
    const { readyStatus, items } = useSelector(stateToProp, shallowEqual)

    // Fetch client-side data here
    useEffect(() => {
        dispatch(fetchDataIfNeed())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    return () => {
        if (!readyStatus || readyStatus === "invalid" || readyStatus === "request")
            return <p>Loading...</p>

        if (readyStatus === "failure") return <p>Oops, Failed to load list!</p>

        return <JavGameList items={items} />
    }
}

const Home: FC<Props> = (): JSX.Element => (
    <div className={styles.Home}>
        <Helmet title="Home" />
        {useList((state: AppState) => state.javGameList, fetchJavGameListIfNeed)()}
    </div>
)

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
    fetchJavGameListIfNeed(),
    // More pre-fetched actions...
]

export default memo(Home)
