import ExpressAccessors from './expressAccessors'
import type { WishWithoutId } from '@/services/wishes'
import { Wish, translationWish } from '@/services/wishes'

const expressAccessor = new ExpressAccessors<WishWithoutId, Wish>(
  'Wishes',
  new Wish(),
  translationWish,
)

export const wishListGet = expressAccessor.listGet()
export const wishGet = expressAccessor.get()
export const wishAdd = expressAccessor.add()
export const wishSet = expressAccessor.set()
