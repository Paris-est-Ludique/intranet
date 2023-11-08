import { useCallback } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { selectUserJwtToken } from '@/store/auth'
import type { AppState } from '@/store'
import { fetchVolunteerPersonalInfoSet } from '@/store/volunteerPersonalInfoSet'
import useAction from '@/utils/useAction'
import type { VolunteerPersonalInfo } from '@/services/volunteers'

type SetFunction = (
  firstname: VolunteerPersonalInfo['firstname'],
  lastname: VolunteerPersonalInfo['lastname'],
  photo: VolunteerPersonalInfo['photo'] | undefined
) => void

export function useUserPersonalInfo(): [VolunteerPersonalInfo | undefined, SetFunction] {
  const save = useAction(fetchVolunteerPersonalInfoSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const userWishes = useSelector(
    (state: AppState) => state.volunteerPersonalInfoSet?.entity,
    shallowEqual,
  )

  const saveWishes: SetFunction = useCallback(
    (firstname, lastname, photo) => {
      if (!userWishes)
        return
      save(jwtToken, 0, {
        id: userWishes.id,
        firstname,
        lastname,
        photo,
      })
    },
    [userWishes, save, jwtToken],
  )

  return [userWishes, saveWishes]
}
