import getExpressAccessors from "./expressAccessors"
import { PreMember, PreMemberWithoutId, translationPreMember } from "../../services/preMembers"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    PreMemberWithoutId,
    PreMember
>("PreMembres", new PreMember(), translationPreMember)

export const preMemberListGet = listGetRequest()

export const preMemberGet = getRequest()

export const preMemberAdd = addRequest()

export const preMemberSet = setRequest()
