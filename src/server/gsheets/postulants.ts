import _ from "lodash"
import ExpressAccessors from "./expressAccessors"
import { Postulant, PostulantWithoutId, translationPostulant } from "../../services/postulants"
import { canonicalEmail, canonicalMobile, trim, validMobile } from "../../utils/standardization"

const expressAccessor = new ExpressAccessors<PostulantWithoutId, Postulant>(
    "Postulants",
    new Postulant(),
    translationPostulant
)

export const postulantListGet = expressAccessor.listGet()
export const postulantGet = expressAccessor.get()
export const postulantAdd = expressAccessor.add(async (list, body) => {
    const params = body
    const postulant = getByEmail(list, params.email)
    if (postulant) {
        throw Error("Il y a déjà quelqu'un avec cet email")
    }
    if (!validMobile(params.mobile)) {
        throw Error("Numéro de téléphone invalide, contacter pierre.scelles@gmail.com")
    }

    const newPostulant = _.omit(new Postulant(), "id")

    _.assign(newPostulant, {
        lastname: trim(params.lastname),
        firstname: trim(params.firstname),
        email: trim(params.email),
        mobile: canonicalMobile(params.mobile),
        howToContact: trim(params.howToContact),
        potential: params.potential === true,
        alreadyCame: params.alreadyCame === true,
        firstMeeting: trim(params.firstMeeting),
        commentFirstMeeting: trim(params.commentFirstMeeting),
        comment: trim(params.comment),
    })

    return {
        toDatabase: newPostulant,
        toCaller: {},
    }
})
export const postulantSet = expressAccessor.set()

function getByEmail<T extends { email: string }>(list: T[], rawEmail: string): T | undefined {
    const email = canonicalEmail(rawEmail || "")
    const volunteer = list.find((v) => canonicalEmail(v.email) === email)
    return volunteer
}
