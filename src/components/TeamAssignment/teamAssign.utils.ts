import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import useAction from "../../utils/useAction"
import { fetchVolunteerTeamAssignSet } from "../../store/volunteerTeamAssignSet"
import { refreshVolunteerList } from "../../store/volunteerList"

export const useTeamAssign = (): [any, any] => {
    const save = useAction(fetchVolunteerTeamAssignSet)
    const refreshVolunteers = useAction(refreshVolunteerList)
    const jwtToken = useSelector(selectUserJwtToken)
    const teamSet = useSelector(
        (state: AppState) => state.volunteerTeamAssignSet?.entity,
        shallowEqual
    )

    const saveWishes = useCallback(
        async (volunteer, teamId) => {
            await save(jwtToken, 0, {
                volunteer: volunteer.id,
                team: volunteer.team === teamId ? 0 : teamId,
            })
            refreshVolunteers()
        },
        [save, refreshVolunteers, jwtToken]
    )

    return [teamSet, saveWishes]
}
