import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerHostingSet } from "../../store/volunteerHostingSet"
import useAction from "../../utils/useAction"

export const useUserHosting = (): [any, any] => {
    const save = useAction(fetchVolunteerHostingSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userWishes = useSelector(
        (state: AppState) => state.volunteerHostingSet?.entity,
        shallowEqual
    )

    const saveWishes = useCallback(
        (needsHosting, canHostCount, distanceToFestival, hostingComment) => {
            if (!userWishes) return
            save(jwtToken, 0, {
                id: userWishes.id,
                needsHosting,
                canHostCount,
                distanceToFestival,
                hostingComment,
            })
        },
        [userWishes, save, jwtToken]
    )

    return [userWishes, saveWishes]
}
