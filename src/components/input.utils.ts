/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"

export const sendTextDispatch =
    (dispatchSetter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatchSetter(e.target.value)

export const sendTextareaDispatch =
    (dispatchSetter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        dispatchSetter(e.target.value)

export const sendBooleanRadioboxDispatch =
    (dispatchSetter: React.Dispatch<React.SetStateAction<boolean>>, isYes: boolean) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatchSetter(isYes ? !!e.target.value : !e.target.value)

export const sendRadioboxDispatch =
    (dispatchSetter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatchSetter(e.target.value)
