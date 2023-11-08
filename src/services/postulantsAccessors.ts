import ServiceAccessors from './accessors'
import type { Postulant, PostulantWithoutId } from './postulants'
import { elementNamePostulant } from './postulants'

const serviceAccessors = new ServiceAccessors<PostulantWithoutId, Postulant>(elementNamePostulant)

export const postulantListGet = serviceAccessors.listGet()
export const postulantGet = serviceAccessors.get()
export const postulantAdd = serviceAccessors.add()
export const postulantSet = serviceAccessors.set()
