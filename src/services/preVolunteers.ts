export class PreVolunteer {
    id = 0

    firstname = ""

    lastname = ""

    email = ""

    mobile = ""

    alreadyVolunteer = false

    comment = ""
}

export const translationPreVolunteer: { [k in keyof PreVolunteer]: string } = {
    id: "id",
    firstname: "prenom",
    lastname: "nom",
    email: "email",
    mobile: "telephone",
    alreadyVolunteer: "dejaBenevole",
    comment: "commentaire",
}

export const elementName = "PreVolunteer"

export const emailRegexp =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
export const passwordMinLength = 4

export type PreVolunteerWithoutId = Omit<PreVolunteer, "id">
