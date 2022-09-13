/* eslint-disable max-classes-per-file */
export class Retex {
    id = 0

    dayWishes = ""

    question1 = -1

    question2 = ""

    question3 = ""

    question4 = ""

    question5 = ""

    question6 = ""

    question7 = ""

    question8 = ""

    question9 = ""
}

export const translationRetex: { [k in keyof Retex]: string } = {
    id: "id",
    dayWishes: "enviesJours",
    question1: "question1",
    question2: "question2",
    question3: "question3",
    question4: "question4",
    question5: "question5",
    question6: "question6",
    question7: "question7",
    question8: "question8",
    question9: "question9",
}

export const elementName = "Retex"

export const volunteerExample: Retex = {
    id: 1,
    dayWishes: "J,S,D",
    question1: 1,
    question2: "Amélie",
    question3: "sadasdsa",
    question4: "",
    question5: "sadasdsa",
    question6: "",
    question7: "",
    question8: "sadasdsa",
    question9: "sadasdsa",
}

export type RetexWithoutId = Omit<Retex, "id">
