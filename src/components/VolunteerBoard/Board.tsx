import type { FC } from 'react'
import { memo } from 'react'
import ContentTitle from '../ui/Content/ContentTitle'
import DayWishes from './DayWishes/DayWishes'
import DayWishesFormModal from './DayWishesForm/DayWishesFormModal'
import Hosting from './Hosting/Hosting'
import HostingFormModal from './HostingForm/HostingFormModal'
import Meals from './Meals/Meals'
import MealsFormModal from './MealsForm/MealsFormModal'
import ParticipationDetails from './ParticipationDetails/ParticipationDetails'
import ParticipationDetailsFormModal from './ParticipationDetailsForm/ParticipationDetailsFormModal'
import TeamWishes from './TeamWishes/TeamWishes'
import TeamWishesFormModal from './TeamWishesForm/TeamWishesFormModal'
import VolunteerTeam from './VolunteerTeam/VolunteerTeam'
import { fetchForDayWishesForm } from './DayWishesForm/DayWishesForm'
import { fetchForHostingForm } from './HostingForm/HostingForm'
import { fetchForMealsForm } from './MealsForm/MealsForm'
import { fetchForParticipationDetailsForm } from './ParticipationDetailsForm/ParticipationDetailsForm'
import { fetchForTeamWishesForm } from './TeamWishesForm/TeamWishesForm'
import { fetchForPersonalInfoForm } from './PersonalInfoForm/PersonalInfoForm'
import PersonalInfo from './PersonalInfo/PersonalInfo'
import PersonalInfoFormModal from './PersonalInfoForm/PersonalInfoFormModal'
import withUserConnected from '@/utils/withUserConnected'

// import Brunch from "./Brunch/Brunch"
// import BrunchFormModal from "./BrunchForm/BrunchFormModal"
// import { fetchForBrunchForm } from "./BrunchForm/BrunchForm"
// import RetexQuestions from "./Retex/RetexQuestions"
// import RetexFormModal from "./RetexForm/RetexFormModal"
// import { fetchForRetexForm } from "./RetexForm/RetexForm"
// import { useRetex } from "./retex.utils"

const Board: FC = (): JSX.Element => (
  //     const [retex] = useRetex()
  //     return (
  <>
    <ContentTitle title="Profil spécifique au festival" />
    <PersonalInfo />
    <PersonalInfoFormModal />
    {/*
      {retex && <Brunch />}
      {retex && <BrunchFormModal />}
      {retex && <Retex />}
      {retex && <RetexFormModal />}
    */}
    <DayWishes />
    <DayWishesFormModal />
    <ParticipationDetails />
    <ParticipationDetailsFormModal />
    <Hosting />
    <HostingFormModal />
    <Meals />
    <MealsFormModal />
    <TeamWishes />
    <TeamWishesFormModal />
    <VolunteerTeam />
  </>
)

export default memo(withUserConnected(Board))

export const fetchForBoard = [
  ...fetchForPersonalInfoForm,
  // ...fetchForRetexForm,
  // ...fetchForBrunchForm,
  ...fetchForDayWishesForm,
  ...fetchForHostingForm,
  ...fetchForMealsForm,
  ...fetchForParticipationDetailsForm,
  ...fetchForTeamWishesForm,
]
