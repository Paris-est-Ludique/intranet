import type { Props } from './TeamsPage'
import { loadData } from './TeamsPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const Teams = loadable(() => import('./TeamsPage'))

function LazyTeams(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Teams {...props} />
    </ErrorBoundary>
  )
}

export default LazyTeams
export { loadData }
