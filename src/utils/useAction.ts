import { useDispatch } from "react-redux"
import { useMemo } from "react"

const useAction = (action: (...args: any[]) => any): any => {
    const dispatch = useDispatch()

    return useMemo(
        () =>
            (...args: any[]) => {
                dispatch(action(...args))
            },
        [dispatch, action]
    )
}

export default useAction
