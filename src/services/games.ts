export class Game {
    id = 0

    title = ""

    bggId = 0

    bggIdAlternative = ""

    bggTitle = ""

    playersMin = 0

    playersMax = 0

    duration = 0

    type: "Ambiance" | "Famille" | "Expert" | "Rapide" | "Jeux à deux" | "Enfants" | "" = ""

    poufpaf = ""

    ean = ""

    bggPhoto = ""

    toBeKnown = false
}

export const translationGame: { [k in keyof Game]: string } = {
    id: "id",
    title: "titre",
    bggId: "bggId",
    bggIdAlternative: "bggIdAlternative",
    bggTitle: "titreBgg",
    playersMin: "minJoueurs",
    playersMax: "maxJoueurs",
    duration: "duree",
    type: "type",
    poufpaf: "poufpaf",
    ean: "ean",
    bggPhoto: "bggPhoto",
    toBeKnown: "àConnaitre",
}

export const elementName = "Game"

export type GameWithoutId = Omit<Game, "id">
