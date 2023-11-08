import ServiceAccessors from './accessors'
import type { Box, BoxWithoutId, DetailedBox } from './boxes'
import { elementNameBox } from './boxes'

const serviceAccessors = new ServiceAccessors<BoxWithoutId, Box>(elementNameBox)

export const detailedBoxListGet = serviceAccessors.customGet<[], DetailedBox>('DetailedListGet')

// export const boxGet = serviceAccessors.get()
// export const boxAdd = serviceAccessors.add()
// export const boxSet = serviceAccessors.set()
