import { get } from "lodash"
import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import { useAskTools, addAsk, answerLaterOnProfile } from "./utils"
import PersonalInfoForm, {
    fetchFor as fetchForPersonalInfoForm,
} from "../VolunteerBoard/PersonalInfoForm/PersonalInfoForm"
import { useUserPersonalInfo } from "../VolunteerBoard/personalInfo.utils"

export function AskPersonalInfo(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const [personalInfo] = useUserPersonalInfo()
    const photo = get(personalInfo, "photo", false)
    const needToShow = !/^[0-9]/.test(photo || "")

    addAsk(
        asks,
        id,
        volunteerAsks,
        false,
        needToShow,
        <PersonalInfoForm afterSubmit={onSubmit}>{answerLaterOnProfile}</PersonalInfoForm>
    )
}

// Fetch server-side data here
export const fetchFor = [...fetchForPersonalInfoForm]
