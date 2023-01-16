import { FC, memo } from "react"
import DayWishes from "./DayWishes/DayWishes"
import DayWishesFormModal from "./DayWishesForm/DayWishesFormModal"
// import Hosting from "./Hosting/Hosting"
// import HostingFormModal from "./HostingForm/HostingFormModal"
// import Meals from "./Meals/Meals"
// import MealsFormModal from "./MealsForm/MealsFormModal"
// import ParticipationDetails from "./ParticipationDetails/ParticipationDetails"
// import ParticipationDetailsFormModal from "./ParticipationDetailsForm/ParticipationDetailsFormModal"
// import TeamWishes from "./TeamWishes/TeamWishes"
// import TeamWishesFormModal from "./TeamWishesForm/TeamWishesFormModal"
// import VolunteerTeam from "./VolunteerTeam/VolunteerTeam"
import withUserConnected from "../../utils/withUserConnected"
import ContentTitle from "../ui/Content/ContentTitle"
import { fetchFor as fetchForDayWishesForm } from "./DayWishesForm/DayWishesForm"
// import { fetchFor as fetchForHostingForm } from "./HostingForm/HostingForm"
// import { fetchFor as fetchForMealsForm } from "./MealsForm/MealsForm"
// import { fetchFor as fetchForParticipationDetailsForm } from "./ParticipationDetailsForm/ParticipationDetailsForm"
// import { fetchFor as fetchForTeamWishesForm } from "./TeamWishesForm/TeamWishesForm"
import { fetchFor as fetchForPersonalInfoForm } from "./PersonalInfoForm/PersonalInfoForm"
import PersonalInfo from "./PersonalInfo/PersonalInfo"
import PersonalInfoFormModal from "./PersonalInfoForm/PersonalInfoFormModal"
// import Brunch from "./Brunch/Brunch"
// import BrunchFormModal from "./BrunchForm/BrunchFormModal"
// import { fetchFor as fetchForBrunchForm } from "./BrunchForm/BrunchForm"
// import Retex from "./Retex/Retex"
// import RetexFormModal from "./RetexForm/RetexFormModal"
// import { fetchFor as fetchForRetexForm } from "./RetexForm/RetexForm"
// import { useRetex } from "./retex.utils"

const Board: FC = (): JSX.Element => (
    // {
    //     const [retex] = useRetex()
    //     return (
    <>
        <ContentTitle title="Profil spécifique au festival" />
        <PersonalInfo />
        <PersonalInfoFormModal />
        {/* {retex && <Brunch />}
            {retex && <BrunchFormModal />}
            {retex && <Retex />}
            {retex && <RetexFormModal />} */}
        <DayWishes />
        <DayWishesFormModal />
        {/* <ParticipationDetails />
        <ParticipationDetailsFormModal />
        <TeamWishes />
        <TeamWishesFormModal />
        <VolunteerTeam />
        <Hosting />
        <HostingFormModal />
        <Meals />
        <MealsFormModal /> */}
    </>
)
//     )
// }

export default memo(withUserConnected(Board))

export const fetchFor = [
    ...fetchForPersonalInfoForm,
    // ...fetchForRetexForm,
    // ...fetchForBrunchForm,
    ...fetchForDayWishesForm,
    // ...fetchForHostingForm,
    // ...fetchForMealsForm,
    // ...fetchForParticipationDetailsForm,
    // ...fetchForTeamWishesForm,
]
