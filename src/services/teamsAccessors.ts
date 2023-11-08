import ServiceAccessors from './accessors'
import type { Team, TeamWithoutId } from './teams'
import { elementNameTeam } from './teams'

const serviceAccessors = new ServiceAccessors<TeamWithoutId, Team>(elementNameTeam)

export const teamListGet = serviceAccessors.listGet()
export const teamGet = serviceAccessors.get()
