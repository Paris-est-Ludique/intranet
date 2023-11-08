import loadable from '@loadable/component'
import type { Props } from './Announcements'
import { loadData } from './Announcements'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import Loading from '@/components/Loading/Loading'

const Announcements = loadable(() => import('./Announcements'), {
  fallback: <Loading />,
})

function LazyAnnouncements(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Announcements {...props} />
    </ErrorBoundary>
  )
}

export default LazyAnnouncements
export { loadData }
