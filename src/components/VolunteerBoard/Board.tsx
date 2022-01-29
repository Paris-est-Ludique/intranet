import { FC, memo } from "react"
import DayWishes from "./DayWishes/DayWishes"
import DayWishesFormModal from "./DayWishesForm/DayWishesFormModal"
import DDayInformations from "./DDayInformations/DDaysInformations"
import withUserConnected from "../../utils/withUserConnected"

const Board: FC = (): JSX.Element => (
    <div>
        <DayWishes />
        <DayWishesFormModal />
        <DDayInformations />
    </div>
)

export default memo(withUserConnected(Board))
