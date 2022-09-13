import { FC, memo, ReactNode, useCallback, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import get from "lodash/get"
import set from "lodash/set"
import classnames from "classnames"
import styles from "./styles.module.scss"
import { useUserTeamWishes } from "../teamWishes.utils"
import { fetchTeamListIfNeed, selectSortedActiveTeams } from "../../../store/teamList"
import useSelection from "../useSelection"
import { fetchVolunteerTeamWishesSetIfNeed } from "../../../store/volunteerTeamWishesSet"
import FormButton from "../../Form/FormButton/FormButton"
import IgnoreButton from "../../Form/IgnoreButton/IgnoreButton"

type Props = {
    children?: ReactNode | undefined
    afterSubmit?: () => void | undefined
}

const TeamWishesForm: FC<Props> = ({ children, afterSubmit }): JSX.Element | null => {
    const teams = useSelector(selectSortedActiveTeams)
    const { selection, setSelection, toggleToSelection, isInSelection } = useSelection()
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [userWishes, saveWishes] = useUserTeamWishes()

    useEffect(() => {
        if (!userWishes) return
        setSelection(...get(userWishes, "teamWishes", []))
        set(commentRef, "current.value", get(userWishes, "teamWishesComment", ""))
    }, [userWishes, setSelection])

    const onTeamClick = useCallback((id: number) => toggleToSelection(id), [toggleToSelection])

    const onSubmit = useCallback(() => {
        const teamWishesComment = get(commentRef, "current.value", "")
        saveWishes(selection as number[], teamWishesComment)
        if (afterSubmit) afterSubmit()
    }, [selection, saveWishes, afterSubmit])

    return (
        <div>
            <div className={styles.title}>Mon choix d'équipe</div>
            <div className={styles.intro}>
                <p>
                    Sélectionne la ou les équipes que tu aimerais rejoindre dans l'ordre de tes
                    préférences.
                </p>
                <p>
                    Tu seras affecté à une équipe pour les jours de festival prochainement et nous
                    tiendrons compte de tes préférences dans la mesure du possible.
                </p>
                <p>
                    Si tu es disponible pour aider en amont, même une autre équipe, n'hésite pas à
                    le mettre en commentaire.
                </p>
                <p>
                    Pour plus d'informations sur les équipes,{" "}
                    <a href="/equipes" target="_blank">
                        clique ici
                    </a>
                    .
                </p>
            </div>
            <div className={styles.formArea}>
                <div className={styles.leftCol}>
                    <div>Mon choix :</div>
                    <ol className={styles.choiceList}>
                        {selection.map((item) => {
                            const team = teams.find((t: any) => t.id === item)
                            if (!team) return null
                            return <li key={team.id}>{team.name}</li>
                        })}
                    </ol>
                    <div className={styles.commentWrapper}>
                        <label htmlFor="day-choice-comment">Un commentaire, une précision ?</label>
                        <textarea id="day-choice-comment" ref={commentRef} />
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <ul className={styles.teamList}>
                        {teams.map((team: any) => (
                            <li
                                key={team.id}
                                className={classnames(
                                    styles.teamItem,
                                    isInSelection(team.id) && styles.active
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => onTeamClick(team.id)}
                                    className={styles.teamButton}
                                >
                                    {team.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.buttonWrapper}>
                <FormButton onClick={onSubmit}>Enregistrer</FormButton>
                {children === undefined && (
                    <>
                        {" "}
                        <FormButton onClick={afterSubmit} type="grey">
                            Annuler
                        </FormButton>{" "}
                    </>
                )}
                {children !== undefined && (
                    <>
                        {" "}
                        <IgnoreButton onClick={afterSubmit} text="Ignorer pour l'instant">
                            {children}
                        </IgnoreButton>{" "}
                    </>
                )}
            </div>
        </div>
    )
}

TeamWishesForm.defaultProps = {
    children: undefined,
    afterSubmit: undefined,
}

export default memo(TeamWishesForm)

// Fetch server-side data here
export const fetchFor = [fetchTeamListIfNeed, fetchVolunteerTeamWishesSetIfNeed]
