import { get, listGet, add, set } from "./accessors"

export class Membre {
    id = 0

    nom = ""

    prenom = ""

    mail = ""

    telephone = ""

    photo = ""

    alimentation = ""

    majeur = 1

    privilege = 0

    actif = 0

    commentaire = ""

    horodatage = ""

    passe = ""
}

export type MembreWithoutId = Omit<Membre, "id">

export const membreGet = get<Membre>("Membre")

export const membreListGet = listGet<Membre>("Membre")

export const membreAdd = add<MembreWithoutId, Membre>("Membre")

export const membreSet = set<Membre>("Membre")
