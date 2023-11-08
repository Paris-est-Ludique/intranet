import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'

import type { AppThunk } from '@/store'
import { selectUserJwtToken } from '@/store/auth'
import { fetchVolunteerListIfNeed } from '@/store/volunteerList'
import Page from '@/components/ui/Page/Page'
import LoginForm from '@/components/LoginForm/LoginForm'

export type Props = RouteComponentProps

const BoardPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  if (jwtToken === undefined)
    return <p>Loading...</p>
  if (jwtToken) {
    return (
      <Page>
        <div>Liste des bénévoles</div>
      </Page>
    )
  }
  return <LoginForm loginNeeded />
}

export const loadData = (): AppThunk[] => [fetchVolunteerListIfNeed()]

export default memo(BoardPage)
