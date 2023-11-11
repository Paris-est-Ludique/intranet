import type React from 'react'
import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import DetailedGameItem from './DetailedGameItem'
import { fetchBoxListIfNeed, selectSortedUniqueDetailedBoxes } from '@/store/boxList'
import { fetchVolunteerLoanSetIfNeed, useVolunteerLoan } from '@/store/volunteerLoanSet'
import type { DetailedBox } from '@/services/boxes'

const Loaning: React.FC = (): JSX.Element | null => {
  const detailedBoxes: DetailedBox[] = useSelector(selectSortedUniqueDetailedBoxes)
  const [volunteerLoan, saveVolunteerLoan] = useVolunteerLoan()
  const [showUnknownOnly, setShowUnknownOnly] = useState(false)

  const onShowUnknownOnly = (e: React.ChangeEvent<HTMLInputElement>) => setShowUnknownOnly(e.target.checked)

  if (!detailedBoxes || detailedBoxes.length === 0) {
    return null
  }
  const boxesToShow = detailedBoxes.filter(
    box =>
      !showUnknownOnly
      || !volunteerLoan
      || (!volunteerLoan.loanable.includes(box.gameId)
        && !volunteerLoan.playable.includes(box.gameId)
        && !volunteerLoan.giftable.includes(box.gameId)
        && !volunteerLoan.noOpinion.includes(box.gameId)),
  )

  return (
    <div className={styles.loanThings}>
      <label className={styles.showCheckboxLabel}>
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
        {boxesToShow.map(game => (
          <DetailedGameItem
            detailedGame={game}
            volunteerLoan={volunteerLoan}
            saveVolunteerLoan={saveVolunteerLoan}
            key={game.id}
          />
        ))}
      </ul>
    </div>
  )
}

export default memo(Loaning)

export const fetchForLoaning = [fetchBoxListIfNeed, fetchVolunteerLoanSetIfNeed]
