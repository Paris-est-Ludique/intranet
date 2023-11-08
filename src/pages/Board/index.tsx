import type { Props } from './Board'
import { loadData } from './Board'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const BoardPage = loadable(() => import('./Board'))

function LazyBoardPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <BoardPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyBoardPage
export { loadData }
