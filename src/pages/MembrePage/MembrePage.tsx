import { useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk } from "../../store"
import { fetchMembreDataIfNeed } from "../../store/membre"
import { MembreInfo, MembreSet } from "../../components"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps<{ id: string }>

const MembrePage = ({ match }: Props): JSX.Element => {
    const { id: rawId } = match.params
    const id = +rawId
    const dispatch = useDispatch()
    const membre = useSelector((state: AppState) => state.membre, shallowEqual)

    useEffect(() => {
        dispatch(fetchMembreDataIfNeed(id))
    }, [dispatch, id])

    const renderInfo = () => {
        const membreInfo = membre

        if (!membreInfo || membreInfo.readyStatus === "request") return <p>Loading...</p>

        if (membreInfo.readyStatus === "failure" || !membreInfo.entity)
            return <p>Oops! Failed to load data.</p>

        return (
            <div>
                <MembreInfo item={membreInfo.entity} />
                <MembreSet dispatch={dispatch} membre={membreInfo.entity} />
            </div>
        )
    }

    return (
        <div className={styles.Membre}>
            <Helmet title="User Info" />
            {renderInfo()}
        </div>
    )
}

interface LoadDataArgs {
    params: { id: number }
}

export const loadData = ({ params }: LoadDataArgs): AppThunk[] => [fetchMembreDataIfNeed(params.id)]

export default memo(MembrePage)
