import type { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

import type { VolunteerLogin } from './volunteers'

export const axiosConfig: AxiosRequestConfig = {
  headers: {},
}

export function setJWT(token: string, id: number, roles: string[]): void {
  axiosConfig.headers.Authorization = `Bearer ${token}`
  Cookies.set('jwt', token, { expires: 3650 })
  Cookies.set('id', `${id}`, { expires: 3650 })
  Cookies.set('roles', roles.join(','), { expires: 3650 })
}

export function unsetJWT(): void {
  delete axiosConfig.headers.Authorization

  Cookies.remove('jwt')
  Cookies.remove('id')
  Cookies.remove('roles')
}

export function getHeadersJWT(cookie = ''): VolunteerLogin {
  const cookies = cookie.split(';').reduce((res: { [cookieName: string]: string }, el: string) => {
    const [k, v] = el.split('=')

    res[k.trim()] = v

    return res
  }, {})

  return {
    jwt: cookies.jwt,
    id: +cookies.id,
    roles: cookies.roles?.split(',') || [],
  }
}

export function getJWT(): VolunteerLogin {
  const jwt = Cookies.get('jwt')
  const id = +(Cookies.get('id') || 0)
  const roles = Cookies.get('roles')?.split(',') || []

  if (jwt && id && roles) {
    Cookies.set('jwt', jwt, { expires: 3650 })
    Cookies.set('id', `${id}`, { expires: 3650 })
    Cookies.set('roles', roles.join(','), { expires: 3650 })

    return {
      jwt,
      id,
      roles,
    }
  }

  return {
    jwt: '',
    id: 0,
    roles: [],
  }
}
