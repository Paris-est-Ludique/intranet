import type { Props } from './KnowledgesPage'
import { loadData } from './KnowledgesPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const KnowledgesPage = loadable(() => import('./KnowledgesPage'), {
  fallback: <Loading />,
})

function LazyKnowledgesPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <KnowledgesPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyKnowledgesPage
export { loadData }
