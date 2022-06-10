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
            { abbr: "V", title: "Sandwich végétarien" },
            { abbr: "F", title: "Sandwich fromage" },
            { abbr: "P", title: "Sandwich poulet" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
    {
        name: "Dimanche midi",
        options: [
            { abbr: "V", title: "Sandwich végétarien" },
            { abbr: "F", title: "Sandwich fromage" },
            { abbr: "P", title: "Sandwich poulet" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
    {
        name: "Dimanche soir",
        options: [
            {
                abbr: "V",
                title: "Lasagnes végétariennes accompagnées de ratatouille et haricots verts",
            },
            { abbr: "P", title: "Aiguillettes de poulet accompagnées de riz thaï" },
            { abbr: "", title: "Pas de repas" },
        ],
    },
]

type SetFunction = (meals: VolunteerMeals["meals"]) => void

export const useUserMeals = (): [VolunteerMeals | undefined, SetFunction] => {
    const save = useAction(fetchVolunteerMealsSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userWishes = useSelector(
        (state: AppState) => state.volunteerMealsSet?.entity,
        shallowEqual
    )

    const saveWishes = useCallback(
        (meals) => {
            if (!userWishes) return
            save(jwtToken, 0, {
                id: userWishes.id,
                meals,
            })
        },
        [userWishes, save, jwtToken]
    )

    return [userWishes, saveWishes]
}
