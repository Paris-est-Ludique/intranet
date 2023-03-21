import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerDayWishesSet } from "../../store/volunteerDayWishesSet"
import useAction from "../../utils/useAction"
import { VolunteerDayWishes } from "../../services/volunteers"

const daysWishesUtils = ["Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche", "Lundi"]

export const daysChoice = daysWishesUtils.map((label) => ({
    id: label[0],
    label,
}))

export interface SelectionChoices {
    [key: string]: boolean
}

export const daysChoiceSelectionDefaultState = daysChoice.reduce((state, { id }) => {
    state[id] = false
    return state
}, <SelectionChoices>{})

type SetFunction = (
    charter: VolunteerDayWishes["charter"],
    active: VolunteerDayWishes["active"],
    dayWishes: VolunteerDayWishes["dayWishes"],
    dayWishesComment: VolunteerDayWishes["dayWishesComment"]
) => void

export const useUserDayWishes = (): [VolunteerDayWishes | undefined, SetFunction] => {
    const save = useAction(fetchVolunteerDayWishesSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userWishes = useSelector(
        (state: AppState) => state.volunteerDayWishesSet?.entity,
        shallowEqual
    )

    const saveWishes: SetFunction = useCallback(
        (charter, active, dayWishes, dayWishesComment) => {
            if (!userWishes) return
            save(jwtToken, 0, {
                id: userWishes.id,
                charter,
                active,
                dayWishes,
                dayWishesComment,
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
