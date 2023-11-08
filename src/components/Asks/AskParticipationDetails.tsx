import get from 'lodash/get'
import { useCallback } from 'react'
import ParticipationDetailsForm, { fetchForParticipationDetailsForm } from '../VolunteerBoard/ParticipationDetailsForm/ParticipationDetailsForm'
import { useUserParticipationDetails } from '../VolunteerBoard/participationDetails.utils'
import { useUserDayWishes } from '../VolunteerBoard/daysWishes.utils'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskParticipationDetails(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [participationDetails] = useUserParticipationDetails()
  const [userWishes] = useUserDayWishes()
  const participation = get(userWishes, 'active', 'inconnu') as string
  const tshirtSize = get(participationDetails, 'tshirtSize', '')
  const food = get(participationDetails, 'food', '')
  const needToShow
        = (participation === 'oui' || participation === 'peut-etre') && (!tshirtSize || !food)

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <ParticipationDetailsForm afterSubmit={onSubmit}>
      {answerLaterOnProfile}
    </ParticipationDetailsForm>,
  )
}

export const fetchForAskParticipationDetails = [...fetchForParticipationDetailsForm]
