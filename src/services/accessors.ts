import axios from 'axios'
import defaultsDeep from 'lodash/defaultsDeep'
import { axiosConfig } from '@/services/auth'

export type ElementWithId = unknown & { id: number }
export type ElementTranslation<Element> = { [k in keyof Element]: string }

const API_URL = import.meta.env.VITE_API_URL

export default class ServiceAccessors<
  ElementNoId extends object,
  Element extends ElementNoId & ElementWithId,
> {
  constructor(readonly elementName: string) {}

  get(): (id: number) => Promise<{
    data?: Element
    error?: Error
  }> {
    interface ElementGetResponse {
      data?: Element
      error?: Error
    }
    return async (id: number): Promise<ElementGetResponse> => {
      try {
        const { data } = await axios.get(`${API_URL}/${this.elementName}Get`, {
          ...axiosConfig,
          params: { id },
        })
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  listGet(): () => Promise<{
    data?: Element[]
    error?: Error
  }> {
    interface ElementListGetResponse {
      data?: Element[]
      error?: Error
    }
    return async (): Promise<ElementListGetResponse> => {
      try {
        const { data } = await axios.get(
          `${API_URL}/${this.elementName}ListGet`,
          axiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  securedListGet(): (jwt: string) => Promise<{
    data?: Element[]
    error?: Error
  }> {
    interface ElementListGetResponse {
      data?: Element[]
      error?: Error
    }
    return async (jwt: string): Promise<ElementListGetResponse> => {
      try {
        const auth = { headers: { Authorization: `Bearer ${jwt}` } }
        const fullAxiosConfig = defaultsDeep(auth, axiosConfig)
        const { data } = await axios.get(
          `${API_URL}/${this.elementName}ListGet`,
          fullAxiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  securedCustomListGet<InputElements extends Array<any>, OutputType>(
    apiName: string,
  ): (
      jwt: string,
      ...params: InputElements
    ) => Promise<{
      data?: any
      error?: Error
    }> {
    interface ElementGetResponse {
      data?: any
      error?: Error
    }
    return async (jwt: string, ...params: InputElements): Promise<ElementGetResponse> => {
      try {
        const auth = { headers: { Authorization: `Bearer ${jwt}` } }
        const fullAxiosConfig = defaultsDeep(auth, axiosConfig)
        const rawData = await axios.get(`${API_URL}/${this.elementName}${apiName}`, {
          ...fullAxiosConfig,
          params,
        })
        const { data } = rawData

        if (data.error) {
          throw new Error(data.error)
        }

        return { data } as { data: OutputType }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  add(): (volunteerWithoutId: ElementNoId) => Promise<{
    data?: Element
    error?: Error
  }> {
    interface ElementGetResponse {
      data?: Element
      error?: Error
    }
    return async (volunteerWithoutId: ElementNoId): Promise<ElementGetResponse> => {
      try {
        const { data } = await axios.post(
          `${API_URL}/${this.elementName}Add`,
          volunteerWithoutId,
          axiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  set(): (volunteer: Element) => Promise<{
    data?: Element
    error?: Error
  }> {
    interface ElementGetResponse {
      data?: Element
      error?: Error
    }
    return async (volunteer: Element): Promise<ElementGetResponse> => {
      try {
        const { data } = await axios.post(
          `${API_URL}/${this.elementName}Set`,
          volunteer,
          axiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  countGet(): () => Promise<{
    data?: number
    error?: Error
  }> {
    interface ElementCountGetResponse {
      data?: number
      error?: Error
    }
    return async (): Promise<ElementCountGetResponse> => {
      try {
        const { data } = await axios.get(
          `${API_URL}/${this.elementName}CountGet`,
          axiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  customGet<InputElements extends Array<any>, OutputType>(
    apiName: string,
  ): (...params: InputElements) => Promise<{
    data?: any
    error?: Error
  }> {
    interface ElementGetResponse {
      data?: any
      error?: Error
    }
    return async (...params: InputElements): Promise<ElementGetResponse> => {
      try {
        const { data } = await axios.get(
          `${API_URL}/${this.elementName}${apiName}`,
          { ...axiosConfig, params },
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data } as { data: OutputType }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  customPost<InputElements extends Array<any>>(
    apiName: string,
  ): (...params: InputElements) => Promise<{
    data?: any
    error?: Error
  }> {
    interface ElementGetResponse {
      data?: any
      error?: Error
    }
    return async (...params: InputElements): Promise<ElementGetResponse> => {
      try {
        const { data } = await axios.post(
          `${API_URL}/${this.elementName}${apiName}`,
          params,
          axiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  securedCustomGet<InputElements extends Array<any>, OutputType>(
    apiName: string,
  ): (
      jwt: string,
      ...params: InputElements
    ) => Promise<{
      data?: any
      error?: Error
    }> {
    interface ElementGetResponse {
      data?: any
      error?: Error
    }
    return async (jwt: string, ...params: InputElements): Promise<ElementGetResponse> => {
      try {
        const auth = { headers: { Authorization: `Bearer ${jwt}` } }
        const fullAxiosConfig = defaultsDeep(auth, axiosConfig)
        const { data } = await axios.get(
          `${API_URL}/${this.elementName}${apiName}`,
          { ...fullAxiosConfig, params },
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data } as { data: OutputType }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }

  securedCustomPost<InputElements extends Array<any>>(
    apiName: string,
  ): (
      jwt: string,
      ...params: InputElements
    ) => Promise<{
      data?: any
      error?: Error
    }> {
    interface ElementGetResponse {
      data?: any
      error?: Error
    }
    return async (jwt: string, ...params: InputElements): Promise<ElementGetResponse> => {
      try {
        const auth = { headers: { Authorization: `Bearer ${jwt}` } }
        const fullAxiosConfig = defaultsDeep(auth, axiosConfig)
        const { data } = await axios.post(
          `${API_URL}/${this.elementName}${apiName}`,
          params,
          fullAxiosConfig,
        )
        if (data.error) {
          throw new Error(data.error)
        }
        return { data }
      }
      catch (error) {
        return { error: error as Error }
      }
    }
  }
}
