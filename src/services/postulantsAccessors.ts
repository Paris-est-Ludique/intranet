import ServiceAccessors from "./accessors"
import { elementName, Postulant, PostulantWithoutId } from "./postulants"

const serviceAccessors = new ServiceAccessors<PostulantWithoutId, Postulant>(elementName)

export const postulantListGet = serviceAccessors.listGet()
export const postulantGet = serviceAccessors.get()
export const postulantAdd = serviceAccessors.add()
export const postulantSet = serviceAccessors.set()
