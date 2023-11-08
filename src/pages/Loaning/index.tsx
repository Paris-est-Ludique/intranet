import type { Props } from './LoaningPage'
import { loadData } from './LoaningPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const Loaning = loadable(() => import('./LoaningPage'), {
  fallback: <Loading />,
})

function LazyLoaning(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Loaning {...props} />
    </ErrorBoundary>
  )
}

export default LazyLoaning
export { loadData }
