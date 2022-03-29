import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import { useUserTeamWishes } from "../VolunteerBoard/teamWishes.utils"
import TeamWishesForm, {
    fetchFor as fetchForTeamWishesForm,
} from "../VolunteerBoard/TeamWishesForm/TeamWishesForm"

export function AskTeamWishes(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [teamWishesData] = useUserTeamWishes()
    const teamWishesString = get(teamWishesData, "teamWishes", [])
    const comment = get(teamWishesData, "teamWishesComment", "")
    const needToShow = teamWishesString.length === 0 && !comment

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <TeamWishesForm afterSubmit={onSubmit}>{answerLaterOnProfile}</TeamWishesForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForTeamWishesForm]
