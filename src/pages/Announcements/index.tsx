import type { Props } from './Announcements'
import { loadData } from './Announcements'
import loadable from '@/components/Loadable'

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const Announcements = loadable(() => import('./Announcements'))

function LazyAnnouncements(props: Props): JSX.Element {
  return (
    <ErrorBoundary>
      <Announcements {...props} />
    </ErrorBoundary>
  )
}

export default LazyAnnouncements
export { loadData }
