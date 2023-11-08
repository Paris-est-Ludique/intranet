import type { Props } from './Register'
import { loadData } from './Register'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const Register = loadable(() => import('./Register'))

function LazyRegister(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Register {...props} />
    </ErrorBoundary>
  )
}

export default LazyRegister
export { loadData }
