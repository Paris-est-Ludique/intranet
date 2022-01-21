import { FC, memo, useCallback, useEffect, useState } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector, shallowEqual, useDispatch } from "react-redux"

import { AppState, AppThunk } from "../../store"
import {
    fetchVolunteerTeamWishesSet,
    fetchVolunteerTeamWishesSetIfNeed,
} from "../../store/volunteerTeamWishesSet"
import { VolunteerTeamWishes } from "../../services/volunteers"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

let prevWishes: VolunteerTeamWishes | undefined

const HomePage: FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    const jwtToken = useSelector(selectUserJwtToken)

    const wishesForm = useSelector((state: AppState) => {
        const wishes = state.volunteerTeamWishesSet?.entity
        if (wishes) {
            prevWishes = wishes
            return wishes
        }
        return prevWishes
    }, shallowEqual)

    const [teamWishes, setTeamWishes] = useState(wishesForm?.teamWishes.join(",") || "")
    const [teamWishesComment, setTeamWishesComment] = useState(wishesForm?.teamWishesComment || "")

    useEffect(() => {
        setTeamWishes(wishesForm?.teamWishes.join(",") || "")
        setTeamWishesComment(wishesForm?.teamWishesComment || "")
    }, [wishesForm])

    const onTeamWishesChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTeamWishes(e.target.value)
    const onTeamWishesCommentChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTeamWishesComment(e.target.value)

    const onSubmit = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            if (!wishesForm) {
                console.error("NO FORM WISHES RECEIVED")
                return // Form should not even appear if this happens
            }
            dispatch(
                fetchVolunteerTeamWishesSet(jwtToken, 0, {
                    id: wishesForm.id,
                    teamWishes: (teamWishes || "").split(","),
                    teamWishesComment,
                })
            )
        },
        [dispatch, jwtToken, wishesForm, teamWishes, teamWishesComment]
    )

    if (jwtToken === undefined) return <p>Loading...</p>

    if (jwtToken) {
        return (
            <form>
                <input
                    type="text"
                    id="teamWishes"
                    required
                    value={teamWishes}
                    onChange={onTeamWishesChanged}
                />
                <br />
                <input
                    type="text"
                    id="teamWishesComment"
                    required
                    value={teamWishesComment}
                    onChange={onTeamWishesCommentChanged}
                />
                <button type="button" onClick={onSubmit}>
                    Envoyer
                </button>
            </form>
        )
    }
    return <div>Besoin d&apos;être identifié</div>
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchVolunteerTeamWishesSetIfNeed()]

export default memo(HomePage)