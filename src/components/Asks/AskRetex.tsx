import get from 'lodash/get'
import { useCallback } from 'react'
import RetexForm, { fetchForRetexForm } from '../VolunteerBoard/RetexForm/RetexForm'
import { useRetex } from '../VolunteerBoard/retex.utils'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskRetex(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [retex] = useRetex()
  const question1Default = '-1'
  const dayWishes = get(retex, 'dayWishes', '')
  const question1 = +get(retex, 'question1', question1Default)
  const question2 = get(retex, 'question2', '')
  const question3 = get(retex, 'question3', '')
  const question4 = get(retex, 'question4', '')
  const question5 = get(retex, 'question5', '')
  const question6 = get(retex, 'question6', '')
  const question7 = get(retex, 'question7', '')
  const question8 = get(retex, 'question8', '')
  const question9 = get(retex, 'question9', '')
  const wasHereBeforeAfter = dayWishes.match(/M|J|V|L/)
  const needToShow
    = !!retex
    && (question1 === -1
      || !question2
      || !question3
      || !question4
      || (wasHereBeforeAfter && !question5)
      || !question6
      || !question7
      || !question8
      || !question9)

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <>
      <RetexForm afterSubmit={onSubmit}>{answerLaterOnProfile}</RetexForm>
      Tes réponses sont modifiable sur la page
      {' '}
      <a href="/profil">Mon profil</a>
      {' '}
      jusqu'au 23 septembre.
    </>,
  )
}

export const fetchForAskRetex = [...fetchForRetexForm]
