import ServiceAccessors from "./accessors"
import { elementName, PreVolunteer, PreVolunteerWithoutId } from "./preVolunteers"

const serviceAccessors = new ServiceAccessors<PreVolunteerWithoutId, PreVolunteer>(elementName)

export const preVolunteerListGet = serviceAccessors.listGet()
export const preVolunteerGet = serviceAccessors.get()
export const preVolunteerAdd = serviceAccessors.add()
export const preVolunteerSet = serviceAccessors.set()
export const preVolunteerCountGet = serviceAccessors.countGet()
