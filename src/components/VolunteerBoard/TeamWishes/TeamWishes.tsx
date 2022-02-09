import { FC, memo, useCallback } from "react"
import { useSelector } from "react-redux"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { displayModal, MODAL_IDS } from "../../../store/ui"
import useAction from "../../../utils/useAction"
import { useUserTeamWishes } from "../teamWishes.utils"
import { selectTeamList } from "../../../store/teamList"

type Props = {
    afterSubmit?: () => void | undefined
}

const TeamWishes: FC<Props> = (): JSX.Element | null => {
    const teams = useSelector(selectTeamList)
    const [teamWishesData] = useUserTeamWishes()
    const teamWishesString = get(teamWishesData, "teamWishes", [])
        .map((id: number): string =>
            get(
                teams.find((team) => team && team.id === id),
                "name",
                ""
            )
        )
        .filter((name: string) => name)
        .join(", ")
    const comment = get(teamWishesData, "teamWishesComment", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.TEAMWISHES), [execDisplayModal])

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mes choix d&apos;équipes</div>
            {teamWishesString && <span>{teamWishesString}</span>}
            {!teamWishesString && <span className={styles.lineEmpty}>Non renseignés</span>}
            {comment && (
                <div className={styles.commentLine}>
                    <span className={styles.commentLineTitle}>Mon commentaire :</span>
                    <span className={styles.commentLineText}>{comment}</span>
                </div>
            )}
            <div className={styles.editButton}>
                <button type="button" onClick={onEdit}>
                    Modifier
                </button>
            </div>
        </div>
    )
}

export default memo(TeamWishes)
