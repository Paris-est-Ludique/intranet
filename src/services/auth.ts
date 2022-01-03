import { AxiosRequestConfig } from "axios"

const storage: any = localStorage

export const axiosConfig: AxiosRequestConfig = {
    headers: {},
}

const jwt: string | null = storage?.getItem("id_token")
if (jwt) {
    setJWT(jwt)
}

export function setJWT(token: string): void {
    axiosConfig.headers.Authorization = `Bearer ${token}`
    storage?.setItem("id_token", token)
}

export function unsetJWT(): void {
    delete axiosConfig.headers.Authorization
    storage?.removeItem("id_token")
}
