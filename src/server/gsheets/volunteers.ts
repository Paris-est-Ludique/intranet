import getExpressAccessors from "./expressAccessors"
import { sheetNames } from "./accessors"
import { Volunteer, VolunteerWithoutId, translationVolunteer } from "../../services/volunteers"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    VolunteerWithoutId,
    Volunteer
>(sheetNames.Volunteers, new Volunteer(), translationVolunteer)

export const volunteerListGet = listGetRequest()

export const volunteerGet = getRequest()

export const volunteerAdd = addRequest()

export const volunteerSet = setRequest()
