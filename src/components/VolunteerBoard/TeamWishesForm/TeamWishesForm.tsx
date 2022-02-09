import { FC, memo, useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import get from "lodash/get"
import set from "lodash/set"
import classnames from "classnames"
import styles from "./styles.module.scss"
import { useUserTeamWishes } from "../teamWishes.utils"
import { selectTeamList } from "../../../store/teamList"
import useSelection from "../useSelection"

type Props = {
    afterSubmit?: () => void | undefined
}

const TeamWishesForm: FC<Props> = ({ afterSubmit }): JSX.Element | null => {
    const teams = useSelector(selectTeamList)
    const { addToSelection, toggleToSelection, isInSelection } = useSelection()
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [userWishes, saveWishes] = useUserTeamWishes()
    const [extendedTeam, setExtendedTeam] = useState<number | null>(null)

    useEffect(() => {
        if (!userWishes) return
        addToSelection(...get(userWishes, "teamWishes", []))
        set(commentRef, "current.value", get(userWishes, "teamWishesComment", ""))
    }, [userWishes, addToSelection])

    const onTeamClick = useCallback((id) => toggleToSelection(id), [toggleToSelection])

    const onExtendClick = useCallback(
        (id) => setExtendedTeam(extendedTeam === id ? null : id),
        [extendedTeam, setExtendedTeam]
    )

    console.log("extendedTeam", extendedTeam)

    const onSubmit = useCallback(() => {
        const teamWishesComment = get(commentRef, "current.value", "")
        const teamWishes = teams
            .map((team) => team && team.id)
            .filter((id) => id && isInSelection(id))
        saveWishes({ teamWishes, teamWishesComment })
        if (afterSubmit) afterSubmit()
    }, [teams, isInSelection, saveWishes, afterSubmit])

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mes choix d&apos;équipes</div>
            <ul className={styles.teamList}>
                {teams.map((team: any) => (
                    <li
                        key={team.id}
                        className={classnames(
                            styles.teamLine,
                            isInSelection(team.id) && styles.active,
                            extendedTeam === team.id && styles.extended
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => onTeamClick(team.id)}
                            className={styles.teamButton}
                        >
                            {team.name}
                        </button>
                        <button
                            type="button"
                            onClick={() => onExtendClick(team.id)}
                            className={styles.extendButton}
                        >
                            Détails
                        </button>
                        <div className={styles.teamDescription}>{team.description}</div>
                    </li>
                ))}
            </ul>
            <div className={styles.commentWrapper}>
                <label htmlFor="day-choice-comment">Un commentaire, une précision ?</label>
                <textarea id="day-choice-comment" ref={commentRef} />
            </div>
            <div className={styles.buttonWrapper}>
                <button type="submit" onClick={onSubmit}>
                    Enregistrer
                </button>
            </div>
        </div>
    )
}

TeamWishesForm.defaultProps = {
    afterSubmit: undefined,
}

export default memo(TeamWishesForm)
