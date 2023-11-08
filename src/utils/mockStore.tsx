import { vi } from 'vitest'
import type { ReactNode } from 'react'
import configurecreateMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

export default (obj = {}): Record<string, any> => {
  const store = configurecreateMockStore([thunk])(obj)
  const originalDispatch = store.dispatch
  store.dispatch = vi.fn(originalDispatch)

  const ProviderWithStore = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return { ...store, ProviderWithStore }
}
