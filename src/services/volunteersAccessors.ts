import ServiceAccessors from "./accessors"
import {
    elementName,
    Volunteer,
    VolunteerDayWishes,
    VolunteerAsks,
    VolunteerParticipationDetails,
    VolunteerTeamWishes,
    VolunteerTeamAssign,
    VolunteerWithoutId,
} from "./volunteers"

const serviceAccessors = new ServiceAccessors<VolunteerWithoutId, Volunteer>(elementName)

export const volunteerListGet = serviceAccessors.listGet()
export const volunteerGet = serviceAccessors.get()
export const volunteerAdd = serviceAccessors.add()
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

export const volunteerTeamAssignSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerTeamAssign>]>("TeamAssignSet")
