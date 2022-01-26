export class Team {
    id = 0

    name = ""

    min = 0

    max = 0

    description = ""

    before = ""

    during = ""

    after = ""
}

export const translationTeam: { [k in keyof Team]: string } = {
    id: "id",
    name: "nom",
    min: "min",
    max: "max",
    description: "description",
    before: "avant",
    during: "pendant",
    after: "après",
}

export const elementName = "Team"

export type TeamWithoutId = Omit<Team, "id">
