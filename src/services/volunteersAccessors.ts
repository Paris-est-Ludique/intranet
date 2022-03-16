import ServiceAccessors from "./accessors"
import {
    elementName,
    Volunteer,
    VolunteerDayWishes,
    VolunteerAsks,
    VolunteerParticipationDetails,
    VolunteerTeamWishes,
    VolunteerWithoutId,
} from "./volunteers"

const serviceAccessors = new ServiceAccessors<VolunteerWithoutId, Volunteer>(elementName)

export const volunteerListGet = serviceAccessors.listGet()
export const volunteerGet = serviceAccessors.get()
export const volunteerPartialAdd = serviceAccessors.customPost<[Partial<Volunteer>]>("PartialAdd")
export const volunteerSet = serviceAccessors.set()

export const volunteerLogin =
    serviceAccessors.customPost<[{ email: string; password: string }]>("Login")

export const volunteerForgot = serviceAccessors.customPost<[{ email: string }]>("Forgot")

export const volunteerAsksSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerAsks>]>("AsksSet")

export const volunteerTeamWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerTeamWishes>]>("TeamWishesSet")

export const volunteerDayWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerDayWishes>]>("DayWishesSet")

export const volunteerParticipationDetailsSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerParticipationDetails>]>(
        "ParticipationDetailsSet"
    )
