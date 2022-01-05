import ExpressAccessors from "./expressAccessors"
import {
    PreVolunteer,
    PreVolunteerWithoutId,
    translationPreVolunteer,
} from "../../services/preVolunteers"

const expressAccessor = new ExpressAccessors<PreVolunteerWithoutId, PreVolunteer>(
    "PreVolunteers",
    new PreVolunteer(),
    translationPreVolunteer
)

export const preVolunteerListGet = expressAccessor.listGet()
export const preVolunteerGet = expressAccessor.get()
export const preVolunteerAdd = expressAccessor.add()
export const preVolunteerSet = expressAccessor.set()

export const preVolunteerCountGet = expressAccessor.get(
    (list?: PreVolunteer[]) => (list && list.length) || 0
)
