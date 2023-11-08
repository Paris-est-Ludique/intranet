import type { Props } from './Register'
import { loadData } from './Register'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const Register = loadable(() => import('./Register'), {
  fallback: <Loading />,
})

function LazyRegister(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Register {...props} />
    </ErrorBoundary>
  )
}

export default LazyRegister
export { loadData }
