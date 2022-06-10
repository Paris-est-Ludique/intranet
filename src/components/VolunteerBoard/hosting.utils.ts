import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerHostingSet } from "../../store/volunteerHostingSet"
import useAction from "../../utils/useAction"
import { VolunteerHosting } from "../../services/volunteers"

type SetFunction = (
    needsHosting: VolunteerHosting["needsHosting"],
    canHostCount: VolunteerHosting["canHostCount"],
    distanceToFestival: VolunteerHosting["distanceToFestival"],
    hostingComment: VolunteerHosting["hostingComment"]
) => void

export const useUserHosting = (): [VolunteerHosting | undefined, SetFunction] => {
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
