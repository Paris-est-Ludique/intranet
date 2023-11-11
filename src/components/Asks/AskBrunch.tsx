import get from 'lodash/get'
import { useCallback } from 'react'
import BrunchForm, { fetchForBrunchForm } from '../VolunteerBoard/BrunchForm/BrunchForm'
import { useBrunch } from '../VolunteerBoard/brunch.utils'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export default function AskBrunch(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [retex] = useBrunch()
  const question1Default = '-1'
  const question1 = +get(retex, 'question1', question1Default)
  const needToShow = !!retex && question1 === -1

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <>
      <BrunchForm afterSubmit={onSubmit}>{answerLaterOnProfile}</BrunchForm>
      Nous avons besoin d'une réponse avant le jeudi 15 soir minuit pour commander les repas ! ^^
    </>,
  )
}

export const fetchForAskBrunch = [...fetchForBrunchForm]
