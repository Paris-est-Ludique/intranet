import ServiceAccessors from './accessors'
import type { Wish, WishWithoutId } from './wishes'
import { elementNameWish } from './wishes'

const serviceAccessors = new ServiceAccessors<WishWithoutId, Wish>(elementNameWish)

export const wishListGet = serviceAccessors.listGet()
export const wishGet = serviceAccessors.get()
export const wishAdd = serviceAccessors.add()
export const wishSet = serviceAccessors.set()
