import { useDispatch } from "react-redux"

const useAction = (action: (...args: any[]) => any): any => {
    const dispatch = useDispatch()

    return (...args: any[]) => {
        dispatch(action(...args))
    }
}

export default useAction
