import type { FC } from 'react'
import { memo, useEffect } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import styles from './styles.module.scss'

import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '@/store'
import { fetchGameListIfNeed } from '@/store/gameList'
import { fetchWishListIfNeed } from '@/store/wishList'

import GameList from '@/components/GameList/GameList'
import WishAdd from '@/components/WishAdd/WishAdd'

export type Props = RouteComponentProps

function useList<Entity>(
  stateToProp: (state: AppState) => EntitiesRequest<Entity>,
  fetchDataIfNeed: () => AppThunk,
) {
  const dispatch = useDispatch()
  const { readyStatus, ids } = useSelector(stateToProp, shallowEqual)

  // Fetch client-side data here
  useEffect(() => {
    dispatch(fetchDataIfNeed())
  }, [dispatch])

  const ListLoadingMessage = () => {
    if (!readyStatus || readyStatus === 'idle' || readyStatus === 'request')
      return <p>Loading...</p>

    if (readyStatus === 'failure')
      return <p>Oops, Failed to load list!</p>

    return <GameList ids={ids} />
  }

  return ListLoadingMessage
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

export const loadData = (): AppThunk[] => [fetchWishListIfNeed(), fetchGameListIfNeed()]

export default memo(Wish)
