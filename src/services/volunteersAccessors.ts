import ServiceAccessors from "./accessors"
import {
    elementName,
    Volunteer,
    VolunteerDayWishes,
    VolunteerHosting,
    VolunteerAsks,
    VolunteerParticipationDetails,
    VolunteerTeamWishes,
    VolunteerTeamAssign,
    VolunteerWithoutId,
    VolunteerDiscordId,
    VolunteerKnowledge,
    VolunteerMeals,
    VolunteerPersonalInfo,
    VolunteerLoan,
} from "./volunteers"

const serviceAccessors = new ServiceAccessors<VolunteerWithoutId, Volunteer>(elementName)

export const volunteerListGet = serviceAccessors.securedListGet()
export const volunteerDiscordIdGet = serviceAccessors.securedCustomGet<
    [number],
    VolunteerDiscordId
>("DiscordId")
export const volunteerAddNew = serviceAccessors.securedCustomPost<[]>("AddNew")
export const volunteerPartialAdd = serviceAccessors.customPost<[Partial<Volunteer>]>("PartialAdd")

export const volunteerSet = serviceAccessors.securedCustomPost<[Partial<Volunteer>]>("Set")

export const volunteerLogin =
    serviceAccessors.customPost<[{ email: string; password: string }]>("Login")

export const volunteerForgot = serviceAccessors.customPost<[{ email: string }]>("Forgot")

export const volunteerAsksSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerAsks>]>("AsksSet")

export const volunteerTeamWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerTeamWishes>]>("TeamWishesSet")

export const volunteerDayWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerDayWishes>]>("DayWishesSet")

export const volunteerHostingSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerHosting>]>("HostingSet")

export const volunteerMealsSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerMeals>]>("MealsSet")

export const volunteerParticipationDetailsSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerParticipationDetails>]>(
        "ParticipationDetailsSet"
    )

export const volunteerPersonalInfoSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerPersonalInfo>]>("PersonalInfoSet")

export const volunteerTeamAssignSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerTeamAssign>]>("TeamAssignSet")

export const volunteerKnowledgeSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerKnowledge>]>("KnowledgeSet")

export const volunteerDetailedKnowledgeList = serviceAccessors.securedCustomPost<[number]>(
    "DetailedKnowledgeListGet"
)

export const volunteerLoanSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerLoan>]>("LoanSet")
