import type { Props } from './TeamAssignmentPage'
import { loadData } from './TeamAssignmentPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const TeamAssignmentPage = loadable(() => import('./TeamAssignmentPage'))

function LazyTeamAssignmentPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <TeamAssignmentPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyTeamAssignmentPage
export { loadData }
