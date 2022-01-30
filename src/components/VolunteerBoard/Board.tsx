import { FC, memo } from "react"
import DayWishes from "./DayWishes/DayWishes"
import DayWishesFormModal from "./DayWishesForm/DayWishesFormModal"
import ParticipationDetailsForm from "./ParticipationDetailsForm/ParticipationDetailsForm"
import withUserConnected from "../../utils/withUserConnected"

const Board: FC = (): JSX.Element => (
    <div>
        <DayWishes />
        <DayWishesFormModal />
        <ParticipationDetailsForm />
    </div>
)

export default memo(withUserConnected(Board))
