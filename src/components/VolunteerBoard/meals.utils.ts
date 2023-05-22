import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerMealsSet } from "../../store/volunteerMealsSet"
import useAction from "../../utils/useAction"
import { VolunteerMeals } from "../../services/volunteers"

export type MealOption = { abbr: string; title: string }
export type MealDay = {
    name: string
    options: MealOption[]
}

export const mealDays: MealDay[] = [
    {
        name: "Samedi midi",
        options: [
            { abbr: "V", title: "Taboulé" },
            { abbr: "F", title: "Quinoa, courgettes, fromage" },
            { abbr: "P", title: "Riz à la Niçoise (thon)" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
    {
        name: "Samedi soir",
        options: [
            {
                abbr: "V",
                title: "Aubergines fondantes avec égrené végétal",
            },
            { abbr: "P", title: "Risotto poulet" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
    {
        name: "Dimanche midi",
        options: [
            { abbr: "V", title: "Sandwich aux légumes" },
            { abbr: "F", title: "Sandwich au fromage" },
            { abbr: "P", title: "Sandwich au poulet" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
    {
        name: "Dimanche soir",
        options: [
            {
                abbr: "V",
                title: "Risotto végétarien",
            },
            { abbr: "P", title: "Parmentier de canard" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
]

type SetFunction = (meals: VolunteerMeals["meals"], food: VolunteerMeals["food"]) => void

export const useUserMeals = (): [VolunteerMeals | undefined, SetFunction] => {
    const save = useAction(fetchVolunteerMealsSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userWishes = useSelector(
        (state: AppState) => state.volunteerMealsSet?.entity,
        shallowEqual
    )

    const saveWishes: SetFunction = useCallback(
        (meals, food) => {
            if (!userWishes) return
            save(jwtToken, 0, {
                id: userWishes.id,
                meals,
                food,
            })
        },
        [userWishes, save, jwtToken]
    )

    return [userWishes, saveWishes]
}
