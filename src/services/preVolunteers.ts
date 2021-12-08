import getServiceAccessors from "./accessors"

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

const { listGet, get, set, add } = getServiceAccessors<PreMemberWithoutId, PreMember>(
    elementName,
    translationPreMember
)

export const preMemberListGet = listGet()
export const preMemberGet = get()
export const preMemberAdd = add()
export const preMemberSet = set()
