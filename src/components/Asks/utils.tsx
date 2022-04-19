import _ from "lodash"
import { Dispatch } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { VolunteerAsks } from "../../services/volunteers"
import { AppState } from "../../store"
import { selectUserJwtToken } from "../../store/auth"
import styles from "./styles.module.scss"

let prevVolunteerAsks: VolunteerAsks | undefined

type AskTools = {
    dispatch: Dispatch<any>
    jwtToken: string
    volunteerAsks: VolunteerAsks | undefined
}

export function useAskTools(): AskTools {
    const dispatch = useDispatch()
    const jwtToken = useSelector(selectUserJwtToken)
    const volunteerAsks = useSelector((state: AppState) => {
        const vAsks = state.volunteerAsksSet?.entity
        if (vAsks) {
            prevVolunteerAsks = vAsks
            return vAsks
        }
        return prevVolunteerAsks
    }, shallowEqual)
    return { dispatch, jwtToken, volunteerAsks }
}

export function addAsk(
    asks: JSX.Element[],
    id: number,
    volunteerAsks: VolunteerAsks | undefined,
    isNarrow: boolean,
    needToShow: boolean,
    children: JSX.Element | undefined
): void {
    const hidden = volunteerAsks?.hiddenAsks || []
    if (_.includes(hidden, id) || !_.isEmpty(asks) || !needToShow) {
        return
    }

    asks.push(
        <div key={id}>
            <div className={styles.notificationsPage}>
                <div
                    className={
                        isNarrow ? styles.notificationsContentNarrow : styles.notificationsContent
                    }
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export const answerLaterOnProfile = (
    <>
        Tu pourras y répondre plus tard sur la page <a href="/profil">Mon profil</a>.
    </>
)
