import type { Props } from './Home'
import { loadData } from './Home'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const HomePage = loadable(() => import('./Home'))

function LazyHomePage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <HomePage {...props} />
    </ErrorBoundary>
  )
}

export default LazyHomePage
export { loadData }
