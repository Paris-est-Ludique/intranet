import { useCallback, useMemo, useReducer } from "react"

type valueType = string | number

type selectionType = {
    [key: string]: boolean
}

type State = {
    selection: selectionType
}

type Action = { type: "add"; payload: valueType[] } | { type: "toggle"; payload: valueType }

interface selectionHook {
    addToSelection: (...values: valueType[]) => void
    toggleToSelection: (value: valueType) => void
    isInSelection: (value: valueType) => boolean
}

const initialState: State = {
    selection: {},
}

const buildIndex = (value: valueType) => `item_${value}`

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "add": {
            const values = action.payload
            return {
                selection: values.reduce(
                    (acc: selectionType, value: valueType) => ({
                        ...acc,
                        [buildIndex(value)]: true,
                    }),
                    state.selection
                ),
            }
        }
        case "toggle": {
            const value = action.payload
            const index = buildIndex(value)
            return {
                selection: {
                    ...state.selection,
                    [index]: !state.selection[index],
                },
            }
        }
        default:
            return state
    }
}

const useSelection = (): selectionHook => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const addToSelection = useCallback(
        (...values: valueType[]) => {
            dispatch({ type: "add", payload: values })
        },
        [dispatch]
    )

    const toggleToSelection = useCallback(
        (value: valueType) => {
            dispatch({ type: "toggle", payload: value })
        },
        [dispatch]
    )

    const isInSelection = useCallback(
        (value: valueType) => {
            const index = buildIndex(value)
            return state.selection[index]
        },
        [state.selection]
    )

    return useMemo(
        () => ({ addToSelection, toggleToSelection, isInSelection }),
        [addToSelection, toggleToSelection, isInSelection]
    )
}

export default useSelection
