import get from 'lodash/get'
import { useCallback } from 'react'
import { useUserDayWishes } from '../VolunteerBoard/daysWishes.utils'
import DayWishesForm, { fetchForDayWishesForm } from '../VolunteerBoard/DayWishesForm/DayWishesForm'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskDayWishes(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [userWishes] = useUserDayWishes()
  const charter = get(userWishes, 'charter', false) as boolean
  const participation = get(userWishes, 'active', 'inconnu') as string
  const newSelection = get(userWishes, 'dayWishes', []) as string[]
  const comment = get(userWishes, 'dayWishesComment', '') as string
  const needToShow
        = charter === false || participation === 'inconnu' || (newSelection.length === 0 && !comment)

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <DayWishesForm afterSubmit={onSubmit}>{answerLaterOnProfile}</DayWishesForm>,
  )
}

export const fetchForAskDayWishes = [...fetchForDayWishesForm]
