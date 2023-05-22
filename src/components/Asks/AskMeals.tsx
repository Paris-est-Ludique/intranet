import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfileBefore } from "./utils"
import MealsForm, { fetchFor as fetchForMealsForm } from "../VolunteerBoard/MealsForm/MealsForm"
import { useUserMeals } from "../VolunteerBoard/meals.utils"
import { useUserDayWishes } from "../VolunteerBoard/daysWishes.utils"

export function AskMeals(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [userMeals] = useUserMeals()
    const [userWishes] = useUserDayWishes()
    const participation = get(userWishes, "active", "inconnu") as string
    const meals = get(userMeals, "meals", [])
    const needToShow =
        (participation === "oui" || participation === "peut-etre") && meals.length === 0

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <MealsForm afterSubmit={onSubmit}>
            {answerLaterOnProfileBefore("31 mai à minuit pour commander les repas !")}
        </MealsForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForMealsForm]
