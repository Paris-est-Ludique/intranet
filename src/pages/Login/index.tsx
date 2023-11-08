import type { Props } from './LoginPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const LoginPage = loadable(() => import('./LoginPage'), {
  fallback: <Loading />,
})

function LazyLogin(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <LoginPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyLogin
