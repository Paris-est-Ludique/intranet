import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import useAction from "../../utils/useAction"
import { fetchVolunteerTeamAssignSet } from "../../store/volunteerTeamAssignSet"

export const useTeamAssign = (): [any, any] => {
    const save = useAction(fetchVolunteerTeamAssignSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const teamSet = useSelector(
        (state: AppState) => state.volunteerTeamAssignSet?.entity,
        shallowEqual
    )

    const saveWishes = useCallback(
        (volunteerId, teamId) => {
            save(jwtToken, 0, {
                volunteer: volunteerId,
                team: teamId,
            })
        },
        [save, jwtToken]
    )

    return [teamSet, saveWishes]
}
