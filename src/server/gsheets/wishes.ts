import getExpressAccessors from "./expressAccessors"
import { sheetNames } from "./accessors"
import { Wish, WishWithoutId, translationWish } from "../../services/wishes"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    WishWithoutId,
    Wish
>(sheetNames.Wishes, new Wish(), translationWish)

export const wishListGet = listGetRequest()

export const wishGet = getRequest()

export const wishAdd = addRequest()

export const wishSet = setRequest()
