import ServiceAccessors from "./accessors"
import { Team, TeamWithoutId, elementName } from "./teams"

const serviceAccessors = new ServiceAccessors<TeamWithoutId, Team>(elementName)

export const teamListGet = serviceAccessors.listGet()
export const teamGet = serviceAccessors.get()
