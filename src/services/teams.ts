export class Team {
    id = 0

    name = ""

    min = 0

    max = 0

    description = ""

    before = ""

    during = ""

    after = ""

    status = ""

    order = 0

    referentFirstnames = ""

    CAPilots = ""
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
    status: "statut",
    order: "ordre",
    referentFirstnames: "prénomsRéférents",
    CAPilots: "pilotesAuCA",
}

export const elementName = "Team"

export type TeamWithoutId = Omit<Team, "id">
