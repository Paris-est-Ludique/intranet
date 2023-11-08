import type { Props } from './Board'
import { loadData } from './Board'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const BoardPage = loadable(() => import('./Board'), {
  fallback: <Loading />,
})

function LazyBoardPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <BoardPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyBoardPage
export { loadData }
