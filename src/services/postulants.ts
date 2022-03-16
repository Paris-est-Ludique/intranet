export class Postulant {
    id = 0

    firstname = ""

    lastname = ""

    email = ""

    mobile = ""

    potential = false

    comment = ""
}

export const translationPostulant: { [k in keyof Postulant]: string } = {
    id: "id",
    firstname: "prenom",
    lastname: "nom",
    email: "email",
    mobile: "telephone",
    potential: "potentiel",
    comment: "commentaire",
}

export const elementName = "Postulant"

export const emailRegexp =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
export const passwordMinLength = 4

export type PostulantWithoutId = Omit<Postulant, "id">
