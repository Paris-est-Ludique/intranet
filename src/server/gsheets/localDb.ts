// eslint-disable-next-line max-classes-per-file
import path from "path"
import _ from "lodash"
import { promises as fs } from "fs"
import { Volunteer } from "../../services/volunteers"
import { Postulant } from "../../services/postulants"

const DB_PATH = path.resolve(process.cwd(), "access/db.json")
const DB_TO_LOAD_PATH = path.resolve(process.cwd(), "access/dbToLoad.json")
const ANONYMIZED_DB_PATH = path.resolve(process.cwd(), "access/dbAnonymized.json")

export class SheetNames {
    Announcements = "Annonces"

    Games = "Jeux"

    Miscs = "Divers"

    Postulants = "Postulants"

    Teams = "Equipes"

    Volunteers = "Membres"

    Wishes = "Envies d'aider"
}

// eslint-disable-next-line @typescript-eslint/ban-types
type States = { [sheetName in keyof SheetNames]?: object[] | undefined }
let states: States = {}
// eslint-disable-next-line @typescript-eslint/ban-types
type Types = { [sheetName in keyof SheetNames]?: object | undefined }
let types: Types = {}

export async function saveLocalDb(
    name: keyof SheetNames,
    // eslint-disable-next-line @typescript-eslint/ban-types
    state: object[] | undefined,
    // eslint-disable-next-line @typescript-eslint/ban-types
    type: object | undefined
): Promise<void> {
    states[name] = state
    types[name] = type
    const toSave = { states, types }
    const jsonDB = __DEV__ ? JSON.stringify(toSave, null, 4) : JSON.stringify(toSave)
    await fs.writeFile(DB_PATH, jsonDB)

    toSave.states = anonimizedDb(toSave.states)
    const jsonAnonimizedDB = __DEV__ ? JSON.stringify(toSave, null, 4) : JSON.stringify(toSave)
    await fs.writeFile(ANONYMIZED_DB_PATH, jsonAnonimizedDB)
}

export async function loadLocalDb(
    name: keyof SheetNames
    // eslint-disable-next-line @typescript-eslint/ban-types
): Promise<{ state: object[]; type: object }> {
    if (_.isEmpty(states)) {
        let stringifiedDb
        try {
            stringifiedDb = await fs.readFile(DB_TO_LOAD_PATH)
        } catch {
            console.error(`No local database save found in ${DB_TO_LOAD_PATH}`)
            process.exit()
        }
        if (stringifiedDb) {
            const db = JSON.parse(stringifiedDb.toString())
            states = db.states
            types = db.types
        }
    }

    if (!states[name]) {
        console.error(`Sheet ${name} couldn't be found in localDb`)
        process.exit()
    }
    return {
        state: states[name] as Element[],
        type: types[name] as Record<keyof Element, string>,
    }
}

export function isDbLoaded(): boolean {
    return !_.isEmpty(states)
}

const fakeFirstnames = [
    "Suzanne",
    "Louis",
    "Madeleine",
    "Paul",
    "Alain",
    "Sylvie",
    "Pierre",
    "Daniel",
    "Jacques",
    "Martine",
    "Anne",
    "Bernard",
    "Claude",
    "Louise",
    "René",
    "Jacqueline",
    "Françoise",
    "Christian",
    "Nathalie",
    "Nicole",
    "Isabelle",
    "Monique",
    "Denise",
    "Marie",
    "Jeanne",
    "Georges",
    "Christine",
    "Nicolas",
    "Michel",
    "Christiane",
    "Jean",
    "Marcel",
    "Marguerite",
    "André",
    "Hélène",
    "Henri",
    "Roger",
    "Catherine",
    "Philippe",
    "Robert",
]
const fakeLastnames = [
    "Bernard",
    "Robert",
    "Guerin",
    "Joly",
    "Dumont",
    "Robin",
    "Vincent",
    "Perrin",
    "Picard",
    "Lefevre",
    "Roy",
    "Martin",
    "Barbier",
    "Clement",
    "Lucas",
    "Gauthier",
    "Duval",
    "Bertrand",
    "Roux",
    "Girard",
    "Dupont",
    "Leroy",
    "Dufour",
    "Muller",
    "Martinez",
    "Thomas",
    "Durand",
    "Dubois",
    "Marie",
    "Marchand",
    "Lefebvre",
    "Brun",
    "Bonnet",
    "Moreau",
    "Francois",
    "Gerard",
    "Rousseau",
    "Faure",
    "Renard",
    "Meunier",
    "David",
    "Giraud",
    "Simon",
    "Vidal",
    "Fournier",
    "Arnaud",
    "Blanchard",
    "Colin",
    "Meyer",
    "Leroux",
    "Lemaire",
    "Mercier",
    "Garnier",
    "Morin",
    "Lambert",
    "Fontaine",
    "Morel",
    "Michel",
    "Blanc",
    "Denis",
    "Noel",
    "Roussel",
    "Riviere",
    "Garcia",
    "Schmitt",
    "Chevalier",
    "Mathieu",
    "Petit",
    "Gautier",
    "Gaillard",
    "Legrand",
    "Henry",
    "Laurent",
    "Caron",
    "Andre",
    "Masson",
    "Nicolas",
    "Roche",
    "Richard",
    "Brunet",
    "Boyer",
]
const fakeEmailDomains = [
    "yahoo.fr",
    "gmail.com",
    "gmail.com",
    "gmail.com",
    "gmail.com",
    "gmail.com",
    "gmail.com",
    "noos.fr",
    "hotmail.com",
    "hotmail.com",
    "hotmail.com",
    "live.fr",
    "hotmail.fr",
    "wanadoo.fr",
    "free.fr",
    "yahoo.com",
    "laposte.net",
    "outlook.com",
    "gmail",
    "mailoo.org",
    "padaone.fr",
    "orange.fr",
    "netcourrier.com",
    "neuf.fr",
    "poptalks.com",
    "GMAIL.COM",
    "wethinkcode.co.za",
    "aliceadsl.fr",
    "inextenso.fr",
    "aol.com",
    "epitech.eu",
    "me.com",
    "sncf.fr",
    "outlook.fr",
    "paris.fr",
    "sfr.fr",
    "lilo.org",
    "protonmail.com",
    "posteo.net",
    "msn.com",
    "mailo.org",
    "live.com",
]

function anonimizedDb(_s: States): States {
    const s = _.cloneDeep(_s)
    if (s.Volunteers) {
        ;(s.Volunteers as Volunteer[]).forEach((v) => {
            anonimizedNameEmailMobile(v)
            if (!idADev(v)) {
                v.photo = `${v.firstname}_${v.lastname}.jpg`.toLowerCase()
            }
            anonimizedPasswords(v)
            anonimizedNotifs(v)
        })
    }
    if (s.Postulants) {
        ;(s.Postulants as Postulant[]).forEach((v) => {
            anonimizedNameEmailMobile(v)
            v.comment = v.id % 3 === 0 ? "Bonjour, j'adore l'initiative!" : ""
        })
    }
    return s
}

function idADev(v: Volunteer | Postulant): boolean {
    return ((v as Volunteer)?.roles || []).includes("dev")
}

function anonimizedNameEmailMobile(v: Volunteer | Postulant): void {
    if (idADev(v)) {
        return
    }

    v.firstname = fakeFirstnames[numberToRand(v.id) % fakeFirstnames.length]
    v.lastname = fakeLastnames[numberToRand(v.id) % fakeLastnames.length]

    const fakeEmailDomain = fakeEmailDomains[numberToRand(v.id) % fakeEmailDomains.length]
    v.email = `${v.firstname}.${v.lastname}.${v.id}@${fakeEmailDomain}`.toLowerCase()

    const mobileStart = v.mobile.match(/^\+?[0-9][0-9]/)
    const mobileEnd = [1, 2, 3, 4]
        .map((n) => `${numberToRand(v.id + n) % 10}${numberToRand(v.id + n + 10) % 10}`)
        .join(" ")
    v.mobile = v.mobile ? `${(mobileStart || ["06"])[0]} ${mobileEnd}` : ""
}

function anonimizedPasswords(v: Volunteer): void {
    if (idADev(v)) {
        v.password1 = "$2b$10$CMv7lEQKWM7XEJtumt0qsOw4dPANs6lT6dI2N27XmJP0Jm4rscmq."
        return
    }

    v.password1 = "$2y$1a$Kt/FAKEFAKEFAKEFAKEc6.FAKEFAKEFAKEFAKE//FAKEFAKEFAKEy"
    v.password2 = "$2y$1a$Kt/FAKEFAKEFAKEFAKEc6.FAKEFAKEFAKEFAKE//FAKEFAKEFAKEy"
}

function anonimizedNotifs(v: Volunteer): void {
    if (idADev(v)) {
        return
    }

    v.acceptsNotifs = ""
    if (v.id % 13 === 0) {
        v.acceptsNotifs = "oui"
    } else if (v.id % 251 === 0) {
        v.acceptsNotifs = "non"
    }
    v.pushNotifSubscription =
        v.id % 13 === 0
            ? '{"endpoint":"https://fcm.googleapis.com/fcm/send/f-EAfakedfakedU:APA91fakedfakedzIk-DEglfakedfaked9ugI--ljtfakedfakedfakedfakedfakedfakedP3t-ggU7Afakedfakedfakedkai","expirationTime":null,"keys":{"p256dh":"BEZOJSfakedfakedfakedfakedfakedfakedfakedfakedfakedfakedgYs-cafakedw","auth":"GlMfakedfakedFRg"}}'
            : ""
}

function numberToRand(n: number) {
    return (1664525 * n + 1013904223) % 512
}
