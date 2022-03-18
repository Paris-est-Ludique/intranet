import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerDayWishesSet } from "../../store/volunteerDayWishesSet"
import useAction from "../../utils/useAction"

const daysWishesUtils = ["Jeudi", "Vendredi", "Samedi", "Dimanche", "Lundi"]

export const daysChoice = daysWishesUtils.map((label) => ({
    id: label[0],
    label,
}))

export interface selectionChoices {
    [key: string]: boolean
}

export const daysChoiceSelectionDefaultState = daysChoice.reduce((state, { id }) => {
    state[id] = false
    return state
}, <selectionChoices>{})

export const useUserDayWishes = (): [any, any] => {
    const save = useAction(fetchVolunteerDayWishesSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userWishes = useSelector(
        (state: AppState) => state.volunteerDayWishesSet?.entity,
        shallowEqual
    )

    const saveWishes = useCallback(
        (active, days, comment) => {
            if (!userWishes) return
            save(jwtToken, 0, {
                id: userWishes.id,
                active,
                dayWishes: days,
                dayWishesComment: comment,
            })
        },
        [userWishes, save, jwtToken]
    )

    return [userWishes, saveWishes]
}

export const getDayLabel = (id: string): string => {
    const matchingDay = daysChoice.find((day) => day.id === id)
    return matchingDay ? matchingDay.label : ""
}
