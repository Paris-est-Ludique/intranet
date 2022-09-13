import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import BrunchForm, { fetchFor as fetchForBrunchForm } from "../VolunteerBoard/BrunchForm/BrunchForm"
import { useBrunch } from "../VolunteerBoard/brunch.utils"

export function AskBrunch(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [retex] = useBrunch()
    const question1Default = "-1"
    const question1 = +get(retex, "question1", question1Default)
    const needToShow = !!retex && question1 === -1

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <>
            <BrunchForm afterSubmit={onSubmit}>{answerLaterOnProfile}</BrunchForm>
            Nous avons besoin d'une réponse avant le jeudi 15 soir minuit pour commander les repas !
            ^^
        </>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForBrunchForm]
