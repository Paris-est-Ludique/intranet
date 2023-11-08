import { useCallback } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import useAction from '@/utils/useAction'
import { selectUserJwtToken } from '@/store/auth'
import type { AppState } from '@/store'
import { fetchRetexSet } from '@/store/retexSet'
import type { Retex } from '@/services/retex'

type SetFunction = (id: Retex['id'], question1: Retex['question1']) => void

export function useBrunch(): [Retex | undefined, SetFunction] {
  const save = useAction(fetchRetexSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const retex = useSelector((state: AppState) => state.retexSet?.entity, shallowEqual)

  const saveBrunch: SetFunction = useCallback(
    (id, question1) => {
      if (!retex)
        return
      save(jwtToken, { id, question1 })
    },
    [retex, save, jwtToken],
  )

  return [retex, saveBrunch]
}
