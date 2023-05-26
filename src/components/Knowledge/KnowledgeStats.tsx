import React, { memo } from "react"
import { useSelector } from "react-redux"
import styles from "./styles.module.scss"
import { fetchBoxListIfNeed, selectSortedUniqueDetailedBoxes } from "../../store/boxList"
import {
    fetchVolunteerDetailedKnowledgeListIfNeed,
    selectVolunteerDetailedKnowledgeList,
} from "../../store/volunteerDetailedKnowledgeList"
import { DetailedBox } from "../../services/boxes"
import { VolunteerDetailedKnowledge } from "../../services/volunteers"

const KnowledgeStats: React.FC = (): JSX.Element | null => {
    const detailedBoxes = useSelector(selectSortedUniqueDetailedBoxes) as DetailedBox[]
    const volunteerDetailedKnowledgeList = useSelector(selectVolunteerDetailedKnowledgeList)

    const knowledgeStats = detailedBoxes.map((box) => ({
        ok: wiseVolunteersNumber(volunteerDetailedKnowledgeList, box.gameId, "ok"),
        bof: wiseVolunteersNumber(volunteerDetailedKnowledgeList, box.gameId, "bof"),
        box,
    }))

    const unknownGames = knowledgeStats.filter((stat) => stat.ok === 0 && stat.bof === 0)

    return (
        <div>
            <p>{unknownGames.length} jeux non connus par des bénévoles :</p>
            <ul>
                {knowledgeStats
                    .filter((stat) => stat.ok === 0 && stat.bof === 0)
                    .map((stat) => (
                        <li key={stat.box.id}>
                            <a
                                href={`https://boardgamegeek.com/boardgame/${stat.box.bggId}`}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.title}
                            >
                                {stat.box.title}
                            </a>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

function wiseVolunteersNumber(
    volunteersKnowledge: VolunteerDetailedKnowledge[],
    gameId: number,
    wiseness: "ok" | "bof"
): number {
    return volunteersKnowledge.filter(
        (v) =>
            v[wiseness].includes(gameId) && (v.dayWishes.includes("S") || v.dayWishes.includes("D"))
    ).length
}

export default memo(KnowledgeStats)

export const fetchFor = [fetchBoxListIfNeed, fetchVolunteerDetailedKnowledgeListIfNeed]
