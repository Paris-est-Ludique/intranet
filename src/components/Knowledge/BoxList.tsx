import React, { memo } from "react"
import { useSelector } from "react-redux"
import styles from "./styles.module.scss"
import BoxItem from "./BoxItem"
import { fetchBoxListIfNeed, selectSortedUniqueDetailedBoxes } from "../../store/boxList"
import {
    fetchVolunteerKnowledgeSetIfNeed,
    useVolunteerKnowledge,
} from "../../store/volunteerKnowledgeSet"

const BoxList: React.FC = (): JSX.Element | null => {
    const detailedBoxes = useSelector(selectSortedUniqueDetailedBoxes)
    const [volunteerKnowledge, saveVolunteerKnowledge] = useVolunteerKnowledge()

    if (!detailedBoxes || detailedBoxes.length === 0) return null

    return (
        <ul className={styles.boxList}>
            {detailedBoxes.map((detailedBox: any) => (
                <BoxItem
                    detailedBox={detailedBox}
                    volunteerKnowledge={volunteerKnowledge}
                    saveVolunteerKnowledge={saveVolunteerKnowledge}
                    key={detailedBox.id}
                />
            ))}
        </ul>
    )
}

export default memo(BoxList)

export const fetchFor = [fetchBoxListIfNeed, fetchVolunteerKnowledgeSetIfNeed]
