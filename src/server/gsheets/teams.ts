import ExpressAccessors from "./expressAccessors"
import { Team, TeamWithoutId, translationTeam } from "../../services/teams"

const expressAccessor = new ExpressAccessors<TeamWithoutId, Team>(
    "Teams",
    new Team(),
    translationTeam
)

export const teamListGet = expressAccessor.listGet()
