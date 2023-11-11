import type React from 'react'
import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import BoxItem from './BoxItem'
import { fetchBoxListIfNeed, selectSortedUniqueDetailedBoxes } from '@/store/boxList'
import { fetchVolunteerKnowledgeSetIfNeed, useVolunteerKnowledge } from '@/store/volunteerKnowledgeSet'

const KnowledgeBoxList: React.FC = (): JSX.Element | null => {
  const detailedBoxes = useSelector(selectSortedUniqueDetailedBoxes)
  const [volunteerKnowledge, saveVolunteerKnowledge] = useVolunteerKnowledge()
  const [showUnknownOnly, setShowUnknownOnly] = useState(false)

  const onShowUnknownOnly = (e: React.ChangeEvent<HTMLInputElement>) => setShowUnknownOnly(e.target.checked)

  if (!detailedBoxes || detailedBoxes.length === 0) {
    return null
  }

  const boxesToShow = detailedBoxes.filter(
    box =>
      !box
      || !showUnknownOnly
      || !volunteerKnowledge
      || (!volunteerKnowledge.ok.includes(box.gameId)
        && !volunteerKnowledge.bof.includes(box.gameId)
        && !volunteerKnowledge.niet.includes(box.gameId)),
  )

  return (
    <div>
      <label className={styles.showUnknownOnlyLabel}>
        <input
          type="checkbox"
          name="showUnknownOnly"
          onChange={onShowUnknownOnly}
          checked={showUnknownOnly}
        />
        {' '}
        Afficher uniquement les non-renseignés
      </label>
      <ul className={styles.boxList}>
        {boxesToShow.map((detailedBox: any) => (
          <BoxItem
            detailedBox={detailedBox}
            volunteerKnowledge={volunteerKnowledge}
            saveVolunteerKnowledge={saveVolunteerKnowledge}
            key={detailedBox.id}
          />
        ))}
      </ul>
    </div>
  )
}

export default memo(KnowledgeBoxList)

export const fetchForKnowledgeBoxList = [fetchBoxListIfNeed, fetchVolunteerKnowledgeSetIfNeed]
