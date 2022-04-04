import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import ParticipationDetailsForm, {
    fetchFor as fetchForParticipationDetailsForm,
} from "../VolunteerBoard/ParticipationDetailsForm/ParticipationDetailsForm"
import { useUserParticipationDetails } from "../VolunteerBoard/participationDetails.utils"

export function AskParticipationDetails(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [participationDetails] = useUserParticipationDetails()
    const tshirtSize = get(participationDetails, "tshirtSize", "")
    const food = get(participationDetails, "food", "")
    const needToShow = !tshirtSize || !food

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <ParticipationDetailsForm afterSubmit={onSubmit}>
            {answerLaterOnProfile}
        </ParticipationDetailsForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForParticipationDetailsForm]
