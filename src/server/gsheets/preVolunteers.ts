import getExpressAccessors from "./expressAccessors"
import { sheetNames } from "./accessors"
import { PreMember, PreMemberWithoutId, translationPreMember } from "../../services/preVolunteers"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    PreMemberWithoutId,
    PreMember
>(sheetNames.PreVolunteers, new PreMember(), translationPreMember)

export const preMemberListGet = listGetRequest()

export const preMemberGet = getRequest()

export const preMemberAdd = addRequest()

export const preMemberSet = setRequest()
