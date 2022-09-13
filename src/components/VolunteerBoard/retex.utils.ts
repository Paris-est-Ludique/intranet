import { useCallback } from "react"
import { shallowEqual, useSelector } from "react-redux"
import useAction from "../../utils/useAction"
import { selectUserJwtToken } from "../../store/auth"
import { AppState } from "../../store"
import { fetchRetexSet } from "../../store/retexSet"
import { Retex } from "../../services/retex"

type SetFunction = (
    id: Retex["id"],
    question2: Retex["question2"],
    question3: Retex["question3"],
    question4: Retex["question4"],
    question5: Retex["question5"],
    question6: Retex["question6"],
    question7: Retex["question7"],
    question8: Retex["question8"],
    question9: Retex["question9"]
) => void

export const useRetex = (): [Retex | undefined, SetFunction] => {
    const save = useAction(fetchRetexSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const retex = useSelector((state: AppState) => state.retexSet?.entity, shallowEqual)

    const saveRetex: SetFunction = useCallback(
        (
            id,
            question2,
            question3,
            question4,
            question5,
            question6,
            question7,
            question8,
            question9
        ) => {
            if (!retex) return
            save(jwtToken, {
                id,
                question2,
                question3,
                question4,
                question5,
                question6,
                question7,
                question8,
                question9,
            })
        },
        [retex, save, jwtToken]
    )

    return [retex, saveRetex]
}
