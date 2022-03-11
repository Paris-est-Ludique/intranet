import { FC, useEffect, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppDispatch, AppState, AppThunk, EntitiesRequest } from "../../store"
import { fetchGameListIfNeed } from "../../store/gameList"
import { fetchWishListIfNeed } from "../../store/wishList"
import { GameList, WishAdd } from "../../components"
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

        return <GameList ids={ids} />
    }
}

const Wish: FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>()
    return (
        <div className={styles.wish}>
            <Helmet title="Wish" />
            <WishAdd dispatch={dispatch} />
            {/* {useList((state: AppState) => state.wishList, fetchWishListifNeed)()} */}
            {useList((state: AppState) => state.gameList, fetchGameListIfNeed)()}
            {/* <button type="button" onClick={() => setList([{id: 3, joueurs: 4, duree: 5, description: "abcd"}])}>
            Set list!
        </button> */}
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchWishListIfNeed(), fetchGameListIfNeed()]

export default memo(Wish)
