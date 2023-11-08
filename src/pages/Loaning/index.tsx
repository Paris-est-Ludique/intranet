import type { Props } from './LoaningPage'
import { loadData } from './LoaningPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const Loaning = loadable(() => import('./LoaningPage'))

function LazyLoaning(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Loaning {...props} />
    </ErrorBoundary>
  )
}

export default LazyLoaning
export { loadData }
