import type { Props } from './ForgotPage'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const ForgotPage = loadable(() => import('./ForgotPage'))

function LazyForgotPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <ForgotPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyForgotPage
