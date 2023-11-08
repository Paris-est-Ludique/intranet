export class Retex {
  id = 0
  dayWishes = ''
  question1 = -1
  question2 = ''
  question3 = ''
  question4 = ''
  question5 = ''
  question6 = ''
  question7 = ''
  question8 = ''
  question9 = ''
}

export const translationRetex: { [k in keyof Retex]: string } = {
  id: 'id',
  dayWishes: 'enviesJours',
  question1: 'question1',
  question2: 'question2',
  question3: 'question3',
  question4: 'question4',
  question5: 'question5',
  question6: 'question6',
  question7: 'question7',
  question8: 'question8',
  question9: 'question9',
}

export const elementNameRetex = 'Retex'

export type RetexWithoutId = Omit<Retex, 'id'>
