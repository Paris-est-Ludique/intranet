import loadable from '@loadable/component'
import type { Props } from './Home'
import { loadData } from './Home'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const HomePage = loadable(() => import('./Home'), {
  fallback: <Loading />,
})

function LazyHomePage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <HomePage {...props} />
    </ErrorBoundary>
  )
}

export default LazyHomePage
export { loadData }
