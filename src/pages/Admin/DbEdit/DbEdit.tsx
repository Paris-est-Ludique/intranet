import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../../store"
import { selectUserJwtToken } from "../../../store/auth"
import { DbEdit, fetchForDbEdit, LoginForm } from "../../../components"

export type Props = RouteComponentProps

const DbEditPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <>
                <DbEdit />
            </>
        )
    }
    return <LoginForm loginNeeded />
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForDbEdit.map((f) => f())]

export default memo(DbEditPage)
