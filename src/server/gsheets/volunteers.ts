import getExpressAccessors from "./expressAccessors"
import { Volunteer, VolunteerWithoutId, translationVolunteer } from "../../services/volunteers"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    VolunteerWithoutId,
    Volunteer
>("Volunteers", new Volunteer(), translationVolunteer)

export const volunteerListGet = listGetRequest()

export const volunteerGet = getRequest()

export const volunteerAdd = addRequest()

export const volunteerSet = setRequest()
