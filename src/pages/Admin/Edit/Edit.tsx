import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'

import type { AppThunk } from '@/store'
import { selectUserJwtToken } from '@/store/auth'
import DbEdit, { fetchForDbEdit } from '@/components/Admin/DbEdit'
import LoginForm from '@/components/LoginForm/LoginForm'

export type Props = RouteComponentProps

const EditPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  if (jwtToken === undefined) {
    return <p>Loading...</p>
  }

  if (jwtToken) {
    return (
      <>
        <DbEdit />
      </>
    )
  }

  return <LoginForm loginNeeded />
}

export const loadData = (): AppThunk[] => [...fetchForDbEdit.map(f => f())]

export default memo(EditPage)
