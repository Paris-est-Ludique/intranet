import ServiceAccessors from "./accessors"
import { elementName, Wish, WishWithoutId } from "./wishes"

const serviceAccessors = new ServiceAccessors<WishWithoutId, Wish>(elementName)

export const wishListGet = serviceAccessors.listGet()
export const wishGet = serviceAccessors.get()
export const wishAdd = serviceAccessors.add()
export const wishSet = serviceAccessors.set()
