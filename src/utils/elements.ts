import type { Action, ActionCreatorWithPayload, ActionCreatorWithoutPayload, ThunkDispatch } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '@/store'

export interface StateRequest {
  readyStatus: 'idle' | 'request' | 'success' | 'failure'
  error?: string
}

export interface ActionsCreators {
  getRequesting: ActionCreatorWithoutPayload<string>
  getSuccess: ActionCreatorWithPayload<any, string>
  getFailure: ActionCreatorWithPayload<string, string>
}

export function elementFetch<Element, ServiceInput extends Array<any>>(
  elementService: (...idArgs: ServiceInput) => Promise<{
    data?: Element | undefined
    error?: Error | undefined
  }>,
  actions: ActionsCreators,
  errorMessage?: (error: Error) => void,
  successMessage?: (data: Element, dispatch: ThunkDispatch<AppState, any, Action>) => void,
): (...idArgs: ServiceInput) => AppThunk {
  return (...idArgs: ServiceInput): AppThunk =>
    async (dispatch: ThunkDispatch<AppState, any, Action>) => {
      dispatch(actions.getRequesting())

      const { error, data } = await elementService(...idArgs)

      if (error) {
        dispatch(actions.getFailure(error.message))
        errorMessage?.(error)
      } else {
        dispatch(actions.getSuccess(data as Element))
        successMessage?.(data as Element, dispatch)
      }
    }
}

export function elementAddFetch<Element, ServiceInput extends Array<any>>(
  elementAddService: (...idArgs: ServiceInput) => Promise<{
    data?: Element | undefined
    error?: Error | undefined
  }>,
  actions: ActionsCreators,
  errorMessage?: (error: Error) => void,
  successMessage?: () => void,
): (...idArgs: ServiceInput) => AppThunk {
  return (...idArgs: ServiceInput): AppThunk =>
    async dispatch => {
      dispatch(actions.getRequesting())

      const { error, data } = await elementAddService(...idArgs)

      if (error) {
        dispatch(actions.getFailure(error.message))
        errorMessage?.(error)
      } else {
        dispatch(actions.getSuccess(data as Element))
        successMessage?.()
      }
    }
}

export function elementListFetch<Element, ServiceInput extends Array<any>>(
  elementListService: (...idArgs: ServiceInput) => Promise<{
    data?: Element[] | undefined
    error?: Error | undefined
  }>,
  actions: ActionsCreators,
  errorMessage?: (error: Error) => void,
  successMessage?: () => void,
): (...idArgs: ServiceInput) => AppThunk {
  return (...idArgs: ServiceInput): AppThunk =>
    async dispatch => {
      dispatch(actions.getRequesting())

      const { error, data } = await elementListService(...idArgs)

      if (error) {
        dispatch(actions.getFailure(error.message))
        errorMessage?.(error)
      } else {
        dispatch(actions.getSuccess(data as Element[]))
        successMessage?.()
      }
    }
}

export function elementValueFetch<Element>(
  elementListService: () => Promise<{
    data?: Element | undefined
    error?: Error | undefined
  }>,
  actions: ActionsCreators,
  errorMessage?: (error: Error) => void,
  successMessage?: () => void,
): () => AppThunk {
  return (): AppThunk => async dispatch => {
    dispatch(actions.getRequesting())

    const { error, data } = await elementListService()

    if (error) {
      dispatch(actions.getFailure(error.message))
      errorMessage?.(error)
    } else {
      dispatch(actions.getSuccess(data as Element))
      successMessage?.()
    }
  }
}
