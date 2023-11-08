import get from 'lodash/get'
import { useCallback } from 'react'
import { useUserTeamWishes } from '../VolunteerBoard/teamWishes.utils'
import TeamWishesForm, { fetchForTeamWishesForm } from '../VolunteerBoard/TeamWishesForm/TeamWishesForm'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskTeamWishes(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [teamWishesData] = useUserTeamWishes()
  const teamWishesString = get(teamWishesData, 'teamWishes', [])
  const comment = get(teamWishesData, 'teamWishesComment', '')
  const needToShow = teamWishesString.length === 0 && !comment

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <TeamWishesForm afterSubmit={onSubmit}>{answerLaterOnProfile}</TeamWishesForm>,
  )
}

export const fetchForAskTeamWishes = [...fetchForTeamWishesForm]
