import type { Props } from './Wish'
import { loadData } from './Wish'
import loadable from '@loadable/component'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const Wish = loadable(() => import('./Wish'), {
  fallback: <Loading />,
})

function LazyWishPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Wish {...props} />
    </ErrorBoundary>
  )
}

export default LazyWishPage
export { loadData }
