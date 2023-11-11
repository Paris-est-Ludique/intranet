import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HistoryRouter as Router } from 'redux-first-history/rr6'
import { App } from './App'
import { history, store } from '@/store'

const { jwt, id, roles } = getJWT()

if (jwt && id && roles) {
  store.dispatch(authSetCurrentUser({ jwt, id, roles }))
} else {
  store.dispatch(authLogoutUser())
}

ReactDOM.hydrateRoot(
  document.getElementById('app'),
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
)

console.info('hydrated')
