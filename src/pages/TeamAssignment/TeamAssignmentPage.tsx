import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'

import type { AppThunk } from '@/store'
import { selectUserJwtToken } from '@/store/auth'
import Page from '@/components/ui/Page/Page'
import LoginForm from '@/components/LoginForm/LoginForm'
import TeamAssignment, { fetchForTeamAssignment } from '@/components/TeamAssignment/TeamAssignment'
import VolunteersWithTeamWishes from '@/components/TeamAssignment/VolunteersWithTeamWishes'

export type Props = RouteComponentProps

const TeamAssignmentPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  if (jwtToken === undefined)
    return <p>Loading...</p>
  if (jwtToken) {
    return (
      <>
        <Page>
          <TeamAssignment />
        </Page>
        <Page>
          <VolunteersWithTeamWishes />
        </Page>
      </>
    )
  }
  return <LoginForm loginNeeded />
}

export const loadData = (): AppThunk[] => [...fetchForTeamAssignment.map((f) => f())]

export default memo(TeamAssignmentPage)
