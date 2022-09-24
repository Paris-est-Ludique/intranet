/* eslint-disable max-classes-per-file */
import { Game } from "./games"

export class Box {
    id = 0

    gameId = 0

    container = ""

    unplayable = false

    specificEan = 0

    missingParts = ""

    verified = new Date()
}

export const translationBox: { [k in keyof Box]: string } = {
    id: "id",
    gameId: "jeuId",
    container: "caisse",
    unplayable: "injouable",
    specificEan: "eanSpécifique",
    missingParts: "partiesManquantes",
    verified: "verifié",
}

export const elementName = "Box"

export type BoxWithoutId = Omit<Box, "id">

export class DetailedBox {
    id = 0

    gameId = 0

    title = new Game().title

    bggId = new Game().bggId

    bggIdAlternative = new Game().bggIdAlternative

    bggPhoto = new Game().bggPhoto

    poufpaf = new Game().poufpaf

    playersMin = new Game().playersMin

    playersMax = new Game().playersMax

    duration = new Game().duration

    type = new Game().type

    container = ""
}

export type DetailedBoxWithoutId = Omit<DetailedBox, "id">
