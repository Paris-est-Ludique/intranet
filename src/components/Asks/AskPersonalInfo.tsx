import get from 'lodash/get'
import { useCallback } from 'react'
import PersonalInfoForm, { fetchForPersonalInfoForm } from '../VolunteerBoard/PersonalInfoForm/PersonalInfoForm'
import { useUserPersonalInfo } from '../VolunteerBoard/personalInfo.utils'
import { addAsk, answerLaterOnProfile, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskPersonalInfo(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  const [personalInfo] = useUserPersonalInfo()
  const photo = get(personalInfo, 'photo', false)
  const needToShow = !/^[0-9]/.test(photo || '')

  addAsk(
    asks,
    id,
    volunteerAsks,
    false,
    needToShow,
    <PersonalInfoForm afterSubmit={onSubmit}>{answerLaterOnProfile}</PersonalInfoForm>,
  )
}

export const fetchForAskPersonalInfo = [...fetchForPersonalInfoForm]
