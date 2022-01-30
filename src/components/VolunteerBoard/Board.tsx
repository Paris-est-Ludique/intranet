import { FC, memo } from "react"
import DayWishes from "./DayWishes/DayWishes"
import DayWishesFormModal from "./DayWishesForm/DayWishesFormModal"
import ParticipationDetails from "./ParticipationDetails/ParticipationDetails"
import ParticipationDetailsFormModal from "./ParticipationDetailsForm/ParticipationDetailsFormModal"
import withUserConnected from "../../utils/withUserConnected"

const Board: FC = (): JSX.Element => (
    <div>
        <DayWishes />
        <DayWishesFormModal />
        <ParticipationDetails />
        <ParticipationDetailsFormModal />
    </div>
)

export default memo(withUserConnected(Board))
