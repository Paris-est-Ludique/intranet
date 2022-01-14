import { AxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

import { VolunteerLogin } from "./volunteers"

const storage: any = localStorage

export const axiosConfig: AxiosRequestConfig = {
    headers: {},
}

export function setJWT(token: string, id: number): void {
    axiosConfig.headers.Authorization = `Bearer ${token}`
    storage?.setItem("jwt", token)
    storage?.setItem("id", id)
    Cookies.set("jwt", token, { expires: 3650 })
    Cookies.set("id", `${id}`, { expires: 3650 })
}

export function unsetJWT(): void {
    delete axiosConfig.headers.Authorization
    storage?.removeItem("jwt")
    storage?.removeItem("id")

    Cookies.remove("jwt")
    Cookies.remove("id")
}

export function getCookieJWT(cookie = ""): VolunteerLogin {
    const cookies = cookie
        .split(";")
        .reduce((res: { [cookieName: string]: string }, el: string) => {
            const [k, v] = el.split("=")
            res[k.trim()] = v
            return res
        }, {})
    return { jwt: cookies.jwt, id: +cookies.id }
}
