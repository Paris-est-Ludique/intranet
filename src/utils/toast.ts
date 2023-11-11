import { toast } from 'react-toastify'

export function toastError(message: string, autoClose: number | false = 6000): void {
  toast.error(message, {
    position: 'top-center',
    ...(autoClose ? { autoClose } : {}),
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export function toastSuccess(message: string, autoClose: number | false = 5000): void {
  toast.success(message, {
    position: 'top-center',
    ...(autoClose ? { autoClose } : {}),
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}
