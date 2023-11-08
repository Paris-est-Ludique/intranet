import loadable from '@loadable/component'
import type { Props } from './GameDetailsUpdate'
import { loadData } from './GameDetailsUpdate'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const GameDetailsUpdatePage = loadable(() => import('./GameDetailsUpdate'), {
  fallback: <Loading />,
})

function LazyGameDetailsUpdatePage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <GameDetailsUpdatePage {...props} />
    </ErrorBoundary>
  )
}

export default LazyGameDetailsUpdatePage
export { loadData }
