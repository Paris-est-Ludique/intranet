export class Game {
    id = 0

    title = ""

    playersMin = 0

    playersMax = 0

    duration = 0

    type: "Ambiance" | "Famille" | "Expert" | "" = ""

    poufpaf = ""

    bggId = 0

    ean = ""

    bggPhoto = ""
}

export const translationGame: { [k in keyof Game]: string } = {
    id: "id",
    title: "titre",
    playersMin: "minJoueurs",
    playersMax: "maxJoueurs",
    duration: "duree",
    type: "type",
    poufpaf: "poufpaf",
    bggId: "bggId",
    ean: "ean",
    bggPhoto: "bggPhoto",
}

export const elementName = "Game"

export type GameWithoutId = Omit<Game, "id">
