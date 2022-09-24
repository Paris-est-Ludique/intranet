import React, { memo, useState } from "react"
import { useSelector } from "react-redux"
import styles from "./styles.module.scss"
import BoxItem from "./BoxItem"
import { fetchBoxListIfNeed, selectSortedUniqueDetailedBoxes } from "../../store/boxList"
import { fetchVolunteerLoanSetIfNeed, useVolunteerLoan } from "../../store/volunteerLoanSet"

const LoanBoxList: React.FC = (): JSX.Element | null => {
    const detailedBoxes = useSelector(selectSortedUniqueDetailedBoxes)
    const [volunteerLoan, saveVolunteerLoan] = useVolunteerLoan()
    const [showUnknownOnly, setShowUnknownOnly] = useState(false)

    const onShowUnknownOnly = (e: React.ChangeEvent<HTMLInputElement>) =>
        setShowUnknownOnly(e.target.checked)

    if (!detailedBoxes || detailedBoxes.length === 0) return null

    const boxesToShow = detailedBoxes.filter(
        (box) =>
            !box ||
            !showUnknownOnly ||
            !volunteerLoan ||
            (!volunteerLoan.loanable.includes(box.gameId) &&
                !volunteerLoan.playable.includes(box.gameId) &&
                !volunteerLoan.giftable.includes(box.gameId) &&
                !volunteerLoan.noOpinion.includes(box.gameId))
    )

    return (
        <div className={styles.loanThings}>
            <label className={styles.showUnknownOnlyLabel}>
                <input
                    type="checkbox"
                    name="showUnknownOnly"
                    onChange={onShowUnknownOnly}
                    checked={showUnknownOnly}
                />{" "}
                Uniquement les non-renseignés
            </label>
            <ul className={styles.boxList}>
                {boxesToShow.map((detailedBox: any) => (
                    <BoxItem
                        detailedBox={detailedBox}
                        volunteerLoan={volunteerLoan}
                        saveVolunteerLoan={saveVolunteerLoan}
                        key={detailedBox.id}
                    />
                ))}
            </ul>
        </div>
    )
}

export default memo(LoanBoxList)

export const fetchFor = [fetchBoxListIfNeed, fetchVolunteerLoanSetIfNeed]
