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
    const needsHosting = get(hosting, "needsHosting", false)
    const canHostCount = get(hosting, "canHostCount", 0)
    const distanceToFestival = get(hosting, "distanceToFestival", 0)
    const hostingComment = get(hosting, "hostingComment", "")
    const needToShow =
        !needsHosting && canHostCount === 0 && distanceToFestival === 0 && hostingComment === ""

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
