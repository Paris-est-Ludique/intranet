import type { Props } from './KnowledgeCardsPage'
import { loadData } from './KnowledgeCardsPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const KnowledgeCardsPage = loadable(() => import('./KnowledgeCardsPage'), {
  fallback: <Loading />,
})

function LazyKnowledgeCardsPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <KnowledgeCardsPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyKnowledgeCardsPage
export { loadData }
