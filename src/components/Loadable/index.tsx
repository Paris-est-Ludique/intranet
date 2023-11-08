import { Suspense, lazy } from 'react'
import Loading from '@/components/Loading/Loading'

function loadable(factory: Parameters<typeof lazy>[0]) {
  return function Loadable() {
    const Component = lazy(factory)

    return (
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    )
  }
}

export default loadable
