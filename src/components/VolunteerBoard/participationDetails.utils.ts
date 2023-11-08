import { useCallback } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import useAction from '@/utils/useAction'
import { selectUserJwtToken } from '@/store/auth'
import type { AppState } from '@/store'
import { fetchVolunteerParticipationDetailsSet } from '@/store/volunteerParticipationDetailsSet'
import type { VolunteerParticipationDetails } from '@/services/volunteers'

export const tshirtSizes = [
  'Aucun',
  'Enfant col rond 2 ans',
  'Enfant col rond 3 ans',
  'Enfant col rond 4 ans',
  'Enfant col rond 5 ans',
  'Enfant col rond 6 ans',
  'Enfant col rond 7 ans',
  'Enfant col rond 8 ans',
  'Enfant col rond 9 ans',
  'Enfant col rond 10 ans',
  'Enfant col rond 11 ans',
  'Enfant col rond 12 ans',
  'Femme col V S',
  'Femme col V M',
  'Femme col V L',
  'Femme col V XL',
  'Femme col V XXL',
  'Femme col V 3XL',
  'Femme col rond XXS',
  'Femme col rond XS',
  'Femme col rond S',
  'Femme col rond M',
  'Femme col rond L',
  'Femme col rond XL',
  'Femme col rond XXL',
  'Femme col rond 3XL',
  'Femme col rond 4XL',
  'Femme col rond 5XL',
  'Homme col V S',
  'Homme col V M',
  'Homme col V L',
  'Homme col V XL',
  'Homme col V XXL',
  'Homme col V 3XL',
  'Homme col rond XXS',
  'Homme col rond XS',
  'Homme col rond S',
  'Homme col rond M',
  'Homme col rond L',
  'Homme col rond XL',
  'Homme col rond XXL',
  'Homme col rond 3XL',
  'Homme col rond 4XL',
  'Homme col rond 5XL',
]

export const foodDefaultValue = 'Aucune'

type SetFunction = (
  tshirtSize: VolunteerParticipationDetails['tshirtSize'],
  adult: VolunteerParticipationDetails['adult']
) => void

export function useUserParticipationDetails(): [
  VolunteerParticipationDetails | undefined,
  SetFunction,
] {
  const save = useAction(fetchVolunteerParticipationDetailsSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const userParticipationDetails = useSelector(
    (state: AppState) => state.volunteerParticipationDetailsSet?.entity,
    shallowEqual,
  )

  const saveParticipationDetails: SetFunction = useCallback(
    (tshirtSize, adult) => {
      if (!userParticipationDetails)
        return
      save(jwtToken, 0, {
        id: userParticipationDetails.id,
        tshirtSize,
        adult,
      })
    },
    [userParticipationDetails, save, jwtToken],
  )

  return [userParticipationDetails, saveParticipationDetails]
}
