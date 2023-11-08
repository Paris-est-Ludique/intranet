import type { Props } from './LoginPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const LoginPage = loadable(() => import('./LoginPage'))

function LazyLogin(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <LoginPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyLogin
