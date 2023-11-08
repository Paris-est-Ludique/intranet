import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'

import type { AppThunk } from '@/store'
import { selectUserJwtToken } from '@/store/auth'
import LoginForm from '@/components/LoginForm/LoginForm'
import GameDetailsUpdate from '@/components/Admin/GameDetailsUpdate'
import { fetchGameDetailsUpdateIfNeed } from '@/store/gameDetailsUpdate'

export type Props = RouteComponentProps

const GameDetailsUpdatePage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  if (jwtToken === undefined)
    return <p>Loading...</p>
  if (jwtToken) {
    return (
      <>
        <GameDetailsUpdate />
      </>
    )
  }
  return <LoginForm loginNeeded />
}

export const loadData = (): AppThunk[] => [...[fetchGameDetailsUpdateIfNeed].map((f) => f())]

export default memo(GameDetailsUpdatePage)
