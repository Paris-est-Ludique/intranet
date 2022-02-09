import { useCallback } from "react"
import { shallowEqual, useSelector } from "react-redux"
import useAction from "../../utils/useAction"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerTeamWishesSet } from "../../store/volunteerTeamWishesSet"

export const useUserTeamWishes = (): [any, any] => {
    const save = useAction(fetchVolunteerTeamWishesSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userTeamWishes = useSelector(
        (state: AppState) => state.volunteerTeamWishesSet?.entity,
        shallowEqual
    )

    const saveTeamWishes = useCallback(
        ({ teamWishes, teamWishesComment }) => {
            if (!userTeamWishes) return
            save(jwtToken, 0, {
                id: userTeamWishes.id,
                teamWishes,
                teamWishesComment,
            })
        },
        [userTeamWishes, save, jwtToken]
    )

    return [userTeamWishes, saveTeamWishes]
}
