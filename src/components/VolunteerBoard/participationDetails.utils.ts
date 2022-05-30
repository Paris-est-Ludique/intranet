import { useCallback } from "react"
import { shallowEqual, useSelector } from "react-redux"
import useAction from "../../utils/useAction"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchVolunteerParticipationDetailsSet } from "../../store/volunteerParticipationDetailsSet"

export const tshirtSizes = [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "4XL",
    "Femme S",
    "Femme M",
    "Femme L",
    "Femme XL",
    "Femme XXL",
    "Femme 3XL",
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
        ({ tshirtSize, tshirtCount, adult, food }) => {
            if (!userParticipationDetails) return
            save(jwtToken, 0, {
                id: userParticipationDetails.id,
                tshirtSize,
                tshirtCount,
                adult,
                food,
            })
        },
        [userParticipationDetails, save, jwtToken]
    )

    return [userParticipationDetails, saveParticipationDetails]
}
