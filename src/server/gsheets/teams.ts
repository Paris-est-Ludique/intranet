import ExpressAccessors from './expressAccessors'
import type { TeamWithoutId } from '@/services/teams'
import { Team, translationTeam } from '@/services/teams'

const expressAccessor = new ExpressAccessors<TeamWithoutId, Team>(
  'Teams',
  new Team(),
  translationTeam,
)

export const teamListGet = expressAccessor.listGet()
