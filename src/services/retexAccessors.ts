import ServiceAccessors from './accessors'
import type { Retex, RetexWithoutId } from './retex'
import { elementNameRetex } from './retex'

const serviceAccessors = new ServiceAccessors<RetexWithoutId, Retex>(elementNameRetex)

export const retexSet = serviceAccessors.securedCustomPost<[Partial<Retex>]>('Set')
