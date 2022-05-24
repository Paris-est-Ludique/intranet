import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../../store"
import { selectUserJwtToken } from "../../../store/auth"
import { GameDetailsUpdate } from "../../../components"
import { fetchGameDetailsUpdateIfNeed } from "../../../store/gameDetailsUpdate"

export type Props = RouteComponentProps

const GameDetailsUpdatePage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <>
                <GameDetailsUpdate />
            </>
        )
    }
    return <div>Besoin d'être identifié</div>
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...[fetchGameDetailsUpdateIfNeed].map((f) => f())]

export default memo(GameDetailsUpdatePage)
