import type { Props } from './TeamAssignmentPage'
import { loadData } from './TeamAssignmentPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const TeamAssignmentPage = loadable(() => import('./TeamAssignmentPage'), {
  fallback: <Loading />,
})

function LazyTeamAssignmentPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <TeamAssignmentPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyTeamAssignmentPage
export { loadData }
