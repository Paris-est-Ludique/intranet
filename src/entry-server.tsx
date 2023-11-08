import { Provider } from 'react-redux'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import type { Request, Response } from 'express'

import { App } from './App'

import { store } from '@/store'
import loadDataOnRoute from '@/server/loadDataOnRoute'

export async function render(request: Request, response: Response, context: MyContext) {
  // [SSR] prepare the store
  const { jwt, id, roles } = getHeadersJWT(request.headers.cookie)
  if (jwt && id && roles) {
    store.dispatch(authSetCurrentUser({ jwt, id, roles }))
  }
  else {
    store.dispatch(authLogoutUser())
  }

  //  TODO add initialState in html

  // [SSR] load data from server side
  await loadDataOnRoute({
    request,
    response,
    store,
  })
  // const initialState = store.getState()

  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={request.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>,
  )
}
