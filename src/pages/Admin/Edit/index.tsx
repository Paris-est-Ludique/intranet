import type { Props } from './Edit'
import { loadData } from './Edit'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const EditPage = loadable(() => import('./Edit'))

function LazyEditPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <EditPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyEditPage
export { loadData }
