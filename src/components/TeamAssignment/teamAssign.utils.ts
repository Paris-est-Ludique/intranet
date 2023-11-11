import { useCallback } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { selectUserJwtToken } from '@/store/auth'
import type { AppState } from '@/store'
import useAction from '@/utils/useAction'
import { fetchVolunteerTeamAssignSet } from '@/store/volunteerTeamAssignSet'
import { refreshVolunteerList } from '@/store/volunteerList'
import type { VolunteerTeamAssign } from '@/services/volunteers'

type SetFunction = (id: VolunteerTeamAssign['id'], team: VolunteerTeamAssign['team']) => void

export function useTeamAssign(): [VolunteerTeamAssign | undefined, SetFunction] {
  const save = useAction(fetchVolunteerTeamAssignSet)
  const refreshVolunteers = useAction(refreshVolunteerList)
  const jwtToken = useSelector(selectUserJwtToken)
  const teamSet = useSelector((state: AppState) => state.volunteerTeamAssignSet?.entity, shallowEqual)

  const saveWishes: SetFunction = useCallback(
    async (id, team) => {
      await save(jwtToken, 0, {
        id,
        team,
      })
      refreshVolunteers(jwtToken)
    },
    [save, refreshVolunteers, jwtToken],
  )

  return [teamSet, saveWishes]
}
