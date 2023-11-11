import type { Props } from './KnowledgeStatsPage'
import { loadData } from './KnowledgeStatsPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const KnowledgeStatsPage = loadable(() => import('./KnowledgeStatsPage'))

function LazyKnowledgeStatsPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <KnowledgeStatsPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyKnowledgeStatsPage
export { loadData }
