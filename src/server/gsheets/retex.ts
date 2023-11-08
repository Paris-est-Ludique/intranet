import cloneDeep from 'lodash/cloneDeep'

import ExpressAccessors from './expressAccessors'
import type { RetexWithoutId } from '@/services/retex'
import { Retex, translationRetex } from '@/services/retex'

const expressAccessor = new ExpressAccessors<RetexWithoutId, Retex>(
  'Retex',
  new Retex(),
  translationRetex,
)

export const retexSet = expressAccessor.set(async (list, body, id, _roles) => {
  const receivedRetex = body[0] as Record<keyof Retex, string>
  if (id !== +receivedRetex.id) {
    throw new Error(`Retex modifié pour un autre member que soit`)
  }
  const retex: Retex | undefined = list.find((v) => v.id === +receivedRetex.id)
  if (!retex) {
    throw new Error(`Il n'y a aucun bénévole avec cet identifiant ${receivedRetex.id}`)
  }
  const newRetex: Retex = cloneDeep(retex)

  const parsedPartialRetex = expressAccessor.parseRawPartialElement(receivedRetex)
  if (parsedPartialRetex === undefined) {
    throw new Error(`Erreur au parsing dans retexSet`)
  }

  if (parsedPartialRetex.question1 !== undefined)
    newRetex.question1 = parsedPartialRetex.question1

  if (parsedPartialRetex.question2 !== undefined)
    newRetex.question2 = parsedPartialRetex.question2

  if (parsedPartialRetex.question3 !== undefined)
    newRetex.question3 = parsedPartialRetex.question3

  if (parsedPartialRetex.question4 !== undefined)
    newRetex.question4 = parsedPartialRetex.question4

  if (parsedPartialRetex.question5 !== undefined)
    newRetex.question5 = parsedPartialRetex.question5

  if (parsedPartialRetex.question6 !== undefined)
    newRetex.question6 = parsedPartialRetex.question6

  if (parsedPartialRetex.question7 !== undefined)
    newRetex.question7 = parsedPartialRetex.question7

  if (parsedPartialRetex.question8 !== undefined)
    newRetex.question8 = parsedPartialRetex.question8

  if (parsedPartialRetex.question9 !== undefined)
    newRetex.question9 = parsedPartialRetex.question9

  return {
    toDatabase: newRetex,
    toCaller: newRetex,
  }
})
