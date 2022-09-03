import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import useAction from "../../utils/useAction"
import { fetchVolunteerTeamAssignSet } from "../../store/volunteerTeamAssignSet"
import { refreshVolunteerList } from "../../store/volunteerList"
import { VolunteerTeamAssign } from "../../services/volunteers"

type SetFunction = (id: VolunteerTeamAssign["id"], team: VolunteerTeamAssign["team"]) => void

export const useTeamAssign = (): [VolunteerTeamAssign | undefined, SetFunction] => {
    const save = useAction(fetchVolunteerTeamAssignSet)
    const refreshVolunteers = useAction(refreshVolunteerList)
    const jwtToken = useSelector(selectUserJwtToken)
    const teamSet = useSelector(
        (state: AppState) => state.volunteerTeamAssignSet?.entity,
        shallowEqual
    )

    const saveWishes: SetFunction = useCallback(
        async (id, team) => {
            await save(jwtToken, 0, {
                id,
                team,
            })
            refreshVolunteers(jwtToken)
        },
        [save, refreshVolunteers, jwtToken]
    )

    return [teamSet, saveWishes]
}
