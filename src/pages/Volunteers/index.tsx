import type { Props } from './Volunteers'
import { loadData } from './Volunteers'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const BoardPage = loadable(() => import('./Volunteers'), {
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
