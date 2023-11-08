import type { Props } from './GameDetailsUpdate'
import { loadData } from './GameDetailsUpdate'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const GameDetailsUpdatePage = loadable(() => import('./GameDetailsUpdate'))

function LazyGameDetailsUpdatePage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <GameDetailsUpdatePage {...props} />
    </ErrorBoundary>
  )
}

export default LazyGameDetailsUpdatePage
export { loadData }
