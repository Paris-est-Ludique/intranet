import { useCallback } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { selectUserJwtToken } from '@/store/auth'
import type { AppState } from '@/store'
import { fetchVolunteerHostingSet } from '@/store/volunteerHostingSet'
import useAction from '@/utils/useAction'
import type { VolunteerHosting } from '@/services/volunteers'

type SetFunction = (
  hostingType: VolunteerHosting['hostingType'],
  canHostCount: VolunteerHosting['canHostCount'],
  cohostVolunteer: VolunteerHosting['cohostVolunteer'],
  backProblems: VolunteerHosting['backProblems'],
  hostingNights: VolunteerHosting['hostingNights'],
  bedType: VolunteerHosting['bedType'],
  isolatedBed: VolunteerHosting['isolatedBed'],
  bedConfiguration: VolunteerHosting['bedConfiguration'],
  hostAddress: VolunteerHosting['hostAddress'],
  petAllergies: VolunteerHosting['petAllergies'],
  transportType: VolunteerHosting['transportType'],
  festivalProximity: VolunteerHosting['festivalProximity'],
  distanceToFestival: VolunteerHosting['distanceToFestival'],
  hostingNeedReason: VolunteerHosting['hostingNeedReason'],
  hostingAbsoluteNeed: VolunteerHosting['hostingAbsoluteNeed']
) => void

export function useUserHosting(): [VolunteerHosting | undefined, SetFunction] {
  const save = useAction(fetchVolunteerHostingSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const userWishes = useSelector(
    (state: AppState) => state.volunteerHostingSet?.entity,
    shallowEqual,
  )

  const saveWishes: SetFunction = useCallback(
    (
      hostingType,
      canHostCount,
      cohostVolunteer,
      backProblems,
      hostingNights,
      bedType,
      isolatedBed,
      bedConfiguration,
      hostAddress,
      petAllergies,
      transportType,
      festivalProximity,
      distanceToFestival,
      hostingNeedReason,
      hostingAbsoluteNeed,
    ) => {
      if (!userWishes)
        return
      save(jwtToken, 0, {
        id: userWishes.id,
        hostingType,
        canHostCount,
        cohostVolunteer,
        backProblems,
        hostingNights,
        bedType,
        isolatedBed,
        bedConfiguration,
        hostAddress,
        petAllergies,
        transportType,
        festivalProximity,
        distanceToFestival,
        hostingNeedReason,
        hostingAbsoluteNeed,
      })
    },
    [userWishes, save, jwtToken],
  )

  return [userWishes, saveWishes]
}

export const bedList: string[] = [
  'un lit une place',
  'un lit 2 places',
  'un canapé ',
  'un canapé-lit',
  'un matelas au sol',
]

type HostLocation = 'Paris' | 'région parisienne' | 'hors région parisienne' | ''
export const hostLocations: HostLocation[] = [
  'Paris',
  'région parisienne',
  'hors région parisienne',
]

export interface NightOption { abbr: string; title: string }

export const nightList: NightOption[] = [
  {
    abbr: 'M',
    title: 'Nuit du mercredi 28 au jeudi 29 juin',
  },
  {
    abbr: 'J',
    title: 'Nuit du jeudi 29 au vendredi 30 juin',
  },
  {
    abbr: 'V',
    title: 'Nuit du vendredi 30 juin au samedi 1er juillet',
  },
  {
    abbr: 'S',
    title: 'Nuit du samedi 1er au dimanche 2 juillet',
  },
  {
    abbr: 'D',
    title: 'Nuit du dimanche 2 au lundi 3 juillet',
  },
  {
    abbr: 'L',
    title: 'Nuit du lundi 3 au mardi 4 juillet',
  },
]

export interface NightChoices {
  [key: string]: boolean
}

export const nightChoiceSelectionDefaultState = nightList.reduce((state, { abbr }) => {
  state[abbr] = false
  state[abbr.toLowerCase()] = false
  return state
}, <NightChoices>{})
