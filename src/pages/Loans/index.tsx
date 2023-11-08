import type { Props } from './LoansPage'
import { loadData } from './LoansPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const Loans = loadable(() => import('./LoansPage'))

function LazyLoans(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Loans {...props} />
    </ErrorBoundary>
  )
}

export default LazyLoans
export { loadData }
