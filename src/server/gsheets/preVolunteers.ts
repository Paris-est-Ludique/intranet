import getExpressAccessors from "./expressAccessors"
import {
    PreVolunteer,
    PreVolunteerWithoutId,
    translationPreVolunteer,
} from "../../services/preVolunteers"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    PreVolunteerWithoutId,
    PreVolunteer
>("PreVolunteers", new PreVolunteer(), translationPreVolunteer)

export const preVolunteerListGet = listGetRequest()

export const preVolunteerGet = getRequest()

export const preVolunteerAdd = addRequest()

export const preVolunteerSet = setRequest()
