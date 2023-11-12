import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HistoryRouter as Router } from 'redux-first-history/rr6'
import { App } from './App'
import { authLogoutUser, authSetCurrentUser } from './store/auth'
import { getJWT } from './services/auth'
import { setupStore } from '@/store'

const { jwt, id, roles } = getJWT()
const { store, history } = setupStore()

if (jwt && id && roles) {
  store.dispatch(authSetCurrentUser({ jwt, id, roles }))
} else {
  store.dispatch(authLogoutUser())
}

function FullApp() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  )
}

const container = document.getElementById('app')

if (import.meta.hot || !container?.textContent) {
  const root = ReactDOM.createRoot(container!)

  root.render(<FullApp />)
  console.info('rendered')
} else {
  ReactDOM.hydrateRoot(container!, <FullApp />)
  console.info('hydrated')
}
