import ServiceAccessors from "./accessors"
import { elementName, Retex, RetexWithoutId } from "./retex"

const serviceAccessors = new ServiceAccessors<RetexWithoutId, Retex>(elementName)

export const retexSet = serviceAccessors.securedCustomPost<[Partial<Retex>]>("Set")
