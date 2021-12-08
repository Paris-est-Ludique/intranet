import { get, listGet, add, set } from "./accessors"

export class PreMember {
    id = 0

    firstname = ""

    lastname = ""

    email = ""

    mobile = ""

    alreadyVolunteer = false

    comment = ""
}

export const translationPreMember: { [k in keyof PreMember]: string } = {
    id: "id",
    firstname: "prenom",
    lastname: "nom",
    email: "email",
    mobile: "telephone",
    alreadyVolunteer: "dejaBenevole",
    comment: "commentaire",
}

const elementName = "PreMember"

export type PreMemberWithoutId = Omit<PreMember, "id">

export const preMemberGet = get<PreMember>(elementName, translationPreMember)

export const preMemberListGet = listGet<PreMember>(elementName, translationPreMember)

export const preMemberAdd = add<PreMemberWithoutId, PreMember>(elementName, translationPreMember)

export const preMemberSet = set<PreMember>(elementName, translationPreMember)
