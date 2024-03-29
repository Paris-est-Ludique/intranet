import { useCallback } from "react"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import styles from "./styles.module.scss"
import { useAskTools, addAsk } from "./utils"
import FormButton from "../Form/FormButton/FormButton"

export function AskWelcome(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    addAsk(
        asks,
        id,
        volunteerAsks,
        true,
        true,
        <form>
            Salut {volunteerAsks?.firstname} !
            <div className={styles.notifIntro} key="login-intro">
                Ici tu seras notifié(e) des nouvelles importantes et des questions pour lesquelles
                il nous faudrait absolument ta réponse.
                <div className={styles.formButtons}>
                    <FormButton onClick={onSubmit}>Ok, continuer</FormButton>
                </div>
            </div>
        </form>
    )
}
