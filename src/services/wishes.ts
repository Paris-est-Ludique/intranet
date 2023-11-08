export class Wish {
  id = 0
  domain = ''
  wish = ''
  details = ''
  teams: string[] = []
  addedDate = ''
}

export const translationWish: { [k in keyof Wish]: string } = {
  id: 'id',
  domain: 'domaine',
  wish: 'wishes',
  details: 'precisions',
  teams: 'equipes',
  addedDate: 'dateAjout',
}

export const elementNameWish = 'Wish'

export type WishWithoutId = Omit<Wish, 'id'>
