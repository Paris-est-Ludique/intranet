import ServiceAccessors from "./accessors"
import { elementName, Box, BoxWithoutId, DetailedBox } from "./boxes"

const serviceAccessors = new ServiceAccessors<BoxWithoutId, Box>(elementName)

export const detailedBoxListGet = serviceAccessors.customGet<[], DetailedBox>("DetailedListGet")
// export const boxGet = serviceAccessors.get()
// export const boxAdd = serviceAccessors.add()
// export const boxSet = serviceAccessors.set()
