export class Postulant {
  id = 0
  firstname = ''
  lastname = ''
  email = ''
  mobile = ''
  howToContact = ''
  potential = false
  alreadyCame = false
  firstMeeting = ''
  commentFirstMeeting = ''
  comment = ''
}

export const translationPostulant: { [k in keyof Postulant]: string } = {
  id: 'id',
  firstname: 'prenom',
  lastname: 'nom',
  email: 'email',
  mobile: 'telephone',
  howToContact: 'commentContacter',
  potential: 'potentiel',
  alreadyCame: 'déjàVenu',
  firstMeeting: 'dateRencontre',
  commentFirstMeeting: 'commentaireDateRencontre',
  comment: 'commentaire',
}

export const elementNamePostulant = 'Postulant'

export type PostulantWithoutId = Omit<Postulant, 'id'>
