import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import HostingForm, {
    fetchFor as fetchForHostingForm,
} from "../VolunteerBoard/HostingForm/HostingForm"
import { useUserHosting } from "../VolunteerBoard/hosting.utils"

export function AskHosting(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [hosting] = useUserHosting()
    const hostingType = get(hosting, "hostingType", false)
    const needToShow = hostingType === ""

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <HostingForm afterSubmit={onSubmit}>{answerLaterOnProfile}</HostingForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForHostingForm]
