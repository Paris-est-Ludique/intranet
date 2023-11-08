import type { Props } from './Edit'
import { loadData } from './Edit'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const EditPage = loadable(() => import('./Edit'), {
  fallback: <Loading />,
})

function LazyEditPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <EditPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyEditPage
export { loadData }
