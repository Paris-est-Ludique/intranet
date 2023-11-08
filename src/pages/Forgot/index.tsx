import type { Props } from './ForgotPage'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const ForgotPage = loadable(() => import('./ForgotPage'), {
  fallback: <Loading />,
})

function LazyForgotPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <ForgotPage {...props} />
    </ErrorBoundary>
  )
}

export default LazyForgotPage
