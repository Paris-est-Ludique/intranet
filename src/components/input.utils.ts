import type React from 'react'

export function sendTextDispatch(dispatchSetter: React.Dispatch<React.SetStateAction<string>>) {
  return (e: React.ChangeEvent<HTMLInputElement>) => dispatchSetter(e.target.value)
}

export function sendTextareaDispatch(dispatchSetter: React.Dispatch<React.SetStateAction<string>>) {
  return (e: React.ChangeEvent<HTMLTextAreaElement>) => dispatchSetter(e.target.value)
}

export function sendBooleanRadioboxDispatch(
  dispatchSetter: React.Dispatch<React.SetStateAction<boolean>>,
  isYes: boolean,
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => dispatchSetter(isYes ? !!e.target.value : !e.target.value)
}

export function sendRadioboxDispatch(dispatchSetter: React.Dispatch<React.SetStateAction<string>>) {
  return (e: React.ChangeEvent<HTMLInputElement>) => dispatchSetter(e.target.value)
}
