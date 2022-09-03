import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import { useUserDayWishes } from "../VolunteerBoard/daysWishes.utils"
import DayWishesForm, {
    fetchFor as fetchForDayWishesForm,
} from "../VolunteerBoard/DayWishesForm/DayWishesForm"

export function AskDayWishes(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [userWishes] = useUserDayWishes()
    const participation = get(userWishes, "active", "inconnu") as string
    const newSelection = get(userWishes, "dayWishes", []) as string[]
    const comment = get(userWishes, "dayWishesComment", "") as string
    const needToShow = participation === "inconnu" || (newSelection.length === 0 && !comment)

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <DayWishesForm afterSubmit={onSubmit}>{answerLaterOnProfile}</DayWishesForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForDayWishesForm]
