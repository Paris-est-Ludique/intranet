import { FC, useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk, ValueRequest } from "../../store"
import { fetchPreVolunteerCountIfNeed } from "../../store/preVolunteerCount"
import { RegisterForm } from "../../components"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

function useList(
    stateToProp: (state: AppState) => ValueRequest<number | undefined>,
    fetchDataIfNeed: () => AppThunk
) {
    const dispatch = useDispatch()
    const { readyStatus, value } = useSelector(stateToProp, shallowEqual)

    // Fetch client-side data here
    useEffect(() => {
        dispatch(fetchDataIfNeed())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    return () => {
        if (!readyStatus || readyStatus === "idle" || readyStatus === "request")
            return <p>Loading...</p>

        if (readyStatus === "failure") return <p>Oops, Failed to load!</p>

        return <RegisterForm dispatch={dispatch} preVolunteerCount={value} />
    }
}

const RegisterPage: FC<Props> = (): JSX.Element => (
    <div className={styles.registerPage}>
        <div className={styles.registerContent}>
            <Helmet title="RegisterPage" />
            {useList((state: AppState) => state.preVolunteerCount, fetchPreVolunteerCountIfNeed)()}
        </div>
    </div>
)

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchPreVolunteerCountIfNeed()]

export default memo(RegisterPage)
