import { Provider } from 'react-redux'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import type { Request, Response } from 'express'

import { App } from './App'

import { store } from '@/store'
import loadDataOnRoute from '@/server/loadDataOnRoute'

export async function render(request: Request, response: Response, context: MyContext, stream: NodeJS.WritableStream) {
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

  // [SSR] render the app with node stream for lazy loaded components with react 18. see: https://react.dev/reference/react-dom/server/renderToPipeableStream#rendering-a-react-tree-as-html-to-a-nodejs-stream
  const { pipe } = ReactDOMServer.renderToPipeableStream(
    <Provider store={store}>
      <StaticRouter location={request.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>,
    {
      bootstrapModules: ['/src/entry-client.tsx'],
      onShellReady() {
        pipe(stream)
      },
    },
  )
}
