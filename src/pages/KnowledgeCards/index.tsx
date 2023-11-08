import type { Props } from './KnowledgeCardsPage'
import { loadData } from './KnowledgeCardsPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const KnowledgeCardsPage = loadable(() => import('./KnowledgeCardsPage'))

function LazyKnowledgeCardsPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <KnowledgeCardsPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyKnowledgeCardsPage
export { loadData }
