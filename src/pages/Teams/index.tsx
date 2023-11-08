import type { Props } from './TeamsPage'
import { loadData } from './TeamsPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const Teams = loadable(() => import('./TeamsPage'), {
  fallback: <Loading />,
})

function LazyTeams(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Teams {...props} />
    </ErrorBoundary>
  )
}

export default LazyTeams
export { loadData }
