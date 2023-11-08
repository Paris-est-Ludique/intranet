import type { Props } from './LoansPage'
import { loadData } from './LoansPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const Loans = loadable(() => import('./LoansPage'), {
  fallback: <Loading />,
})

function LazyLoans(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Loans {...props} />
    </ErrorBoundary>
  )
}

export default LazyLoans
export { loadData }
