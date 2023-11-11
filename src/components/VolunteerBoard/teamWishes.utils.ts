import { useCallback } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import useAction from '@/utils/useAction'
import { selectUserJwtToken } from '@/store/auth'
import type { AppState } from '@/store'
import { fetchVolunteerTeamWishesSet } from '@/store/volunteerTeamWishesSet'
import type { VolunteerTeamWishes } from '@/services/volunteers'

type SetFunction = (
  teamWishes: VolunteerTeamWishes['teamWishes'],
  teamWishesComment: VolunteerTeamWishes['teamWishesComment'],
) => void

export function useUserTeamWishes(): [VolunteerTeamWishes | undefined, SetFunction] {
  const save = useAction(fetchVolunteerTeamWishesSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const userTeamWishes = useSelector((state: AppState) => state.volunteerTeamWishesSet?.entity, shallowEqual)

  const saveTeamWishes: SetFunction = useCallback(
    (teamWishes, teamWishesComment) => {
      if (!userTeamWishes) {
        return
      }
      save(jwtToken, 0, {
        id: userTeamWishes.id,
        teamWishes,
        teamWishesComment,
      })
    },
    [userTeamWishes, save, jwtToken],
  )

  return [userTeamWishes, saveTeamWishes]
}
