import type { Props } from './Volunteers'
import { loadData } from './Volunteers'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const BoardPage = loadable(() => import('./Volunteers'))

function LazyBoardPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <BoardPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyBoardPage
export { loadData }
