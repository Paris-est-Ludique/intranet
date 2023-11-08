import type { Props } from './Wish'
import { loadData } from './Wish'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const Wish = loadable(() => import('./Wish'))

function LazyWishPage(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Wish {...props} />
    </ErrorBoundary>
  )
}

export default LazyWishPage
export { loadData }
