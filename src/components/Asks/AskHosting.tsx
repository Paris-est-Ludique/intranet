import get from 'lodash/get'
import { useCallback } from 'react'
import HostingForm, { fetchForHostingForm } from '../VolunteerBoard/HostingForm/HostingForm'
import { useUserHosting } from '../VolunteerBoard/hosting.utils'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskHosting(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [hosting] = useUserHosting()
  const hostingType = get(hosting, 'hostingType', false)
  const needToShow = hostingType === ''

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <HostingForm afterSubmit={onSubmit}>{answerLaterOnProfile}</HostingForm>,
  )
}

export const fetchForAskHosting = [...fetchForHostingForm]
