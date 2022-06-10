import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import MealsForm, { fetchFor as fetchForMealsForm } from "../VolunteerBoard/MealsForm/MealsForm"
import { useUserMeals } from "../VolunteerBoard/meals.utils"

export function AskMeals(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [meals] = useUserMeals()
    const needsMeals = get(meals, "needsMeals", false)
    const canHostCount = get(meals, "canHostCount", 0)
    const distanceToFestival = get(meals, "distanceToFestival", 0)
    const mealsComment = get(meals, "mealsComment", "")
    const needToShow =
        !needsMeals && canHostCount === 0 && distanceToFestival === 0 && mealsComment === ""

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <MealsForm afterSubmit={onSubmit}>{answerLaterOnProfile}</MealsForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForMealsForm]
