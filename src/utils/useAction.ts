import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

function useAction(action: (...args: any[]) => any): any {
  const dispatch = useDispatch()

  return useMemo(
    () =>
      (...args: any[]) => {
        dispatch(action(...args))
      },
    [dispatch, action],
  )
}

export default useAction
