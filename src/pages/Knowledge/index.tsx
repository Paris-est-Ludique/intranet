import type { Props } from './KnowledgesPage'
import { loadData } from './KnowledgesPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const KnowledgesPage = loadable(() => import('./KnowledgesPage'))

function LazyKnowledgesPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <KnowledgesPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyKnowledgesPage
export { loadData }
