import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { AppThunk } from "."

export interface StateRequest {
    readyStatus: "idle" | "request" | "success" | "failure"
    error?: string
}

export function toastError(message: string): void {
    toast.error(message, {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export function toastSuccess(message: string): void {
    toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export function elementFetch<Element>(
    elementService: (...idArgs: any[]) => Promise<{
        data?: Element | undefined
        error?: Error | undefined
    }>,
    getRequesting: ActionCreatorWithoutPayload<string>,
    getSuccess: ActionCreatorWithPayload<Element, string>,
    getFailure: ActionCreatorWithPayload<string, string>,
    errorMessage?: (error: Error) => void,
    successMessage?: (data: Element) => void
): (...idArgs: any[]) => AppThunk {
    return (...idArgs: any[]): AppThunk =>
        async (dispatch) => {
            dispatch(getRequesting())

            const { error, data } = await elementService(...idArgs)

            if (error) {
                dispatch(getFailure(error.message))
                if (errorMessage) {
                    errorMessage(error)
                }
            } else {
                dispatch(getSuccess(data as Element))
                if (successMessage) {
                    successMessage(data as Element)
                }
            }
        }
}

export function elementAddFetch<Element>(
    elementAddService: (volunteerWithoutId: Omit<Element, "id">) => Promise<{
        data?: Element | undefined
        error?: Error | undefined
    }>,
    getRequesting: ActionCreatorWithoutPayload<string>,
    getSuccess: ActionCreatorWithPayload<Element, string>,
    getFailure: ActionCreatorWithPayload<string, string>,
    errorMessage: (error: Error) => void = (_error) => {
        /* Meant to be empty */
    },
    successMessage: () => void = () => {
        /* Meant to be empty */
    }
): (volunteerWithoutId: Omit<Element, "id">) => AppThunk {
    return (volunteerWithoutId: Omit<Element, "id">): AppThunk =>
        async (dispatch) => {
            dispatch(getRequesting())

            const { error, data } = await elementAddService(volunteerWithoutId)

            if (error) {
                dispatch(getFailure(error.message))
                errorMessage(error)
            } else {
                dispatch(getSuccess(data as Element))
                successMessage()
            }
        }
}

export function elementListFetch<Element>(
    elementListService: () => Promise<{
        data?: Element[] | undefined
        error?: Error | undefined
    }>,
    getRequesting: ActionCreatorWithoutPayload<string>,
    getSuccess: ActionCreatorWithPayload<Element[], string>,
    getFailure: ActionCreatorWithPayload<string, string>,
    errorMessage: (error: Error) => void = (_error) => {
        /* Meant to be empty */
    },
    successMessage: () => void = () => {
        /* Meant to be empty */
    }
): () => AppThunk {
    return (): AppThunk => async (dispatch) => {
        dispatch(getRequesting())

        const { error, data } = await elementListService()

        if (error) {
            dispatch(getFailure(error.message))
            errorMessage(error)
        } else {
            dispatch(getSuccess(data as Element[]))
            successMessage()
        }
    }
}

export function elementSet<Element>(
    elementSetService: (volunteer: Element) => Promise<{
        data?: Element | undefined
        error?: Error | undefined
    }>,
    getRequesting: ActionCreatorWithoutPayload<string>,
    getSuccess: ActionCreatorWithPayload<Element, string>,
    getFailure: ActionCreatorWithPayload<string, string>,
    errorMessage: (error: Error) => void = (_error) => {
        /* Meant to be empty */
    },
    successMessage: () => void = () => {
        /* Meant to be empty */
    }
): (element: Element) => AppThunk {
    return (element: Element): AppThunk =>
        async (dispatch) => {
            dispatch(getRequesting())

            const { error, data } = await elementSetService(element)

            if (error) {
                dispatch(getFailure(error.message))
                errorMessage(error)
            } else {
                dispatch(getSuccess(data as Element))
                successMessage()
            }
        }
}

export function elementValueFetch<Element>(
    elementListService: () => Promise<{
        data?: Element | undefined
        error?: Error | undefined
    }>,
    getRequesting: ActionCreatorWithoutPayload<string>,
    getSuccess: ActionCreatorWithPayload<Element, string>,
    getFailure: ActionCreatorWithPayload<string, string>,
    errorMessage: (error: Error) => void = (_error) => {
        /* Meant to be empty */
    },
    successMessage: () => void = () => {
        /* Meant to be empty */
    }
): () => AppThunk {
    return (): AppThunk => async (dispatch) => {
        dispatch(getRequesting())

        const { error, data } = await elementListService()

        if (error) {
            dispatch(getFailure(error.message))
            errorMessage(error)
        } else {
            dispatch(getSuccess(data as Element))
            successMessage()
        }
    }
}
