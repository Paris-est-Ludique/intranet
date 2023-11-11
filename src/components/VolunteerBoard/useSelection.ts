import { useCallback, useMemo, useReducer } from 'react'

type valueType = string | number

interface State {
  selection: valueType[]
}

type Action = { type: 'set'; payload: valueType[] } | { type: 'toggle'; payload: valueType }

interface selectionHook {
  selection: valueType[]
  setSelection: (...values: valueType[]) => void
  toggleToSelection: (value: valueType) => void
  isInSelection: (value: valueType) => boolean
}

const initialState: State = {
  selection: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set': {
      const values = action.payload

      return { selection: values }
    }
    case 'toggle': {
      const value = action.payload
      const index = state.selection.findIndex(item => item === value)

      if (index !== -1) {
        state.selection.splice(index, 1)
      } else {
        state.selection.push(value)
      }

      return {
        selection: [...state.selection],
      }
    }
    default:
      return state
  }
}

function useSelection(): selectionHook {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setSelection = useCallback(
    (...values: valueType[]) => {
      dispatch({ type: 'set', payload: values })
    },
    [dispatch],
  )

  const toggleToSelection = useCallback(
    (value: valueType) => {
      dispatch({ type: 'toggle', payload: value })
    },
    [dispatch],
  )

  const isInSelection = useCallback(
    (value: valueType) => !!state.selection.find(item => item === value),
    [state.selection],
  )

  return useMemo(
    () => ({
      selection: state.selection,
      setSelection,
      toggleToSelection,
      isInSelection,
    }),
    [state.selection, setSelection, toggleToSelection, isInSelection],
  )
}

export default useSelection
