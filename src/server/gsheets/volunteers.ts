import ExpressAccessors from "./expressAccessors"
import { Volunteer, VolunteerWithoutId, translationVolunteer } from "../../services/volunteers"

const expressAccessor = new ExpressAccessors<VolunteerWithoutId, Volunteer>(
    "Volunteers",
    new Volunteer(),
    translationVolunteer
)

export const volunteerListGet = expressAccessor.listGet()

export const volunteerGet = expressAccessor.get()

export const volunteerAdd = expressAccessor.add()

export const volunteerSet = expressAccessor.set()
