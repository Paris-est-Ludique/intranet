import { useCallback } from "react"
import { shallowEqual, useSelector } from "react-redux"
import useAction from "../../utils/useAction"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerParticipationDetailsSet } from "../../store/volunteerParticipationDetailsSet"

export const tShirtSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "Femme S",
    "Femme M",
    "Femme L",
    "Femme XL",
]

export const foodDefaultValue = "Aucune"

export const useUserParticipationDetails = (): [any, any] => {
    const save = useAction(fetchVolunteerParticipationDetailsSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const userParticipationDetails = useSelector(
        (state: AppState) => state.volunteerParticipationDetailsSet?.entity,
        shallowEqual
    )

    const saveParticipationDetails = useCallback(
        ({ age, teeshirtSize, food }) => {
            if (!userParticipationDetails) return
            save(jwtToken, 0, {
                id: userParticipationDetails.id,
                age,
                teeshirtSize,
                food,
            })
        },
        [userParticipationDetails, save, jwtToken]
    )

    return [userParticipationDetails, saveParticipationDetails]
}
