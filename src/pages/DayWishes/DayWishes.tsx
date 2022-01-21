import { FC, memo, useCallback, useEffect, useState } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector, shallowEqual, useDispatch } from "react-redux"

import { AppState, AppThunk } from "../../store"
import {
    fetchVolunteerDayWishesSet,
    fetchVolunteerDayWishesSetIfNeed,
} from "../../store/volunteerDayWishesSet"
import { VolunteerDayWishes } from "../../services/volunteers"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

let prevWishes: VolunteerDayWishes | undefined

const HomePage: FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    const jwtToken = useSelector(selectUserJwtToken)

    const wishesForm = useSelector((state: AppState) => {
        const wishes = state.volunteerDayWishesSet?.entity
        if (wishes) {
            prevWishes = wishes
            return wishes
        }
        return prevWishes
    }, shallowEqual)

    const [dayWishes, setDayWishes] = useState(wishesForm?.dayWishes.join(",") || "")
    const [dayWishesComment, setDayWishesComment] = useState(wishesForm?.dayWishesComment || "")

    useEffect(() => {
        setDayWishes(wishesForm?.dayWishes.join(",") || "")
        setDayWishesComment(wishesForm?.dayWishesComment || "")
    }, [wishesForm])

    const onDayWishesChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setDayWishes(e.target.value)
    const onDayWishesCommentChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setDayWishesComment(e.target.value)

    const onSubmit = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            if (!wishesForm) {
                console.error("NO FORM WISHES RECEIVED")
                return // Form should not even appear if this happens
            }
            dispatch(
                fetchVolunteerDayWishesSet(jwtToken, 0, {
                    id: wishesForm.id,
                    dayWishes: (dayWishes || "").split(","),
                    dayWishesComment,
                })
            )
        },
        [dispatch, jwtToken, wishesForm, dayWishes, dayWishesComment]
    )

    if (jwtToken === undefined) return <p>Loading...</p>

    if (jwtToken) {
        return (
            <form>
                <input
                    type="text"
                    id="dayWishes"
                    required
                    value={dayWishes}
                    onChange={onDayWishesChanged}
                />
                <br />
                <input
                    type="text"
                    id="dayWishesComment"
                    required
                    value={dayWishesComment}
                    onChange={onDayWishesCommentChanged}
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
export const loadData = (): AppThunk[] => [fetchVolunteerDayWishesSetIfNeed()]

export default memo(HomePage)
