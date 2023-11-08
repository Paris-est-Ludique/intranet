import type { Action } from '@reduxjs/toolkit'
import type { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import type { Request, Response } from 'express'
import type { RouteMatch } from 'react-router'
import { matchRoutes } from 'react-router'
import { routes } from '@/routes'

interface LoadDataOnRouteParams {
  request: Request
  response: Response
  store: ToolkitStore
}

function loadDataOnRoute({ request, response, store }: LoadDataOnRouteParams): Promise<any> {
  const matchedRoutes: RouteMatch[] = matchRoutes(routes, request.path)
  const promises = matchedRoutes?.map(({ route, params }) => {
    if (route.loadData) {
      return Promise.all(
        route
          .loadData({
            params,
            getState: store.getState,
            req: request,
            res: response,
          })
          .map((item: Action) => store.dispatch(item)),
      )
    }

    return Promise.resolve(null)
  })

  return Promise.all(promises)
}

export default loadDataOnRoute
