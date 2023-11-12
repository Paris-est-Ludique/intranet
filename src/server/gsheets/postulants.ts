import omit from 'lodash/omit'
import assign from 'lodash/assign'
import sgMail from '@sendgrid/mail'
import ExpressAccessors from './expressAccessors'
import { getSheet } from './accessors'
import type { PostulantWithoutId } from '@/services/postulants'
import { Postulant, translationPostulant } from '@/services/postulants'
import { canonicalEmail, canonicalMobile, trim, validMobile } from '@/utils/standardization'
import type { MiscWithoutId } from '@/services/miscs'
import { Misc, translationMisc } from '@/services/miscs'
import { IS_DEV } from '@/utils/constants'

const expressAccessor = new ExpressAccessors<PostulantWithoutId, Postulant>(
  'Postulants',
  new Postulant(),
  translationPostulant,
)

export const postulantListGet = expressAccessor.listGet()
export const postulantGet = expressAccessor.get()
export const postulantAdd = expressAccessor.add(async (list, body) => {
  const params = body
  const postulant = getByEmail(list, params.email)

  if (postulant) {
    throw new Error('Il y a déjà quelqu\'un avec cet email')
  }

  if (!validMobile(params.mobile)) {
    throw new Error('Numéro de téléphone invalide, contacter pierre.scelles@gmail.com')
  }

  const newPostulant = omit(new Postulant(), 'id')

  assign(newPostulant, {
    lastname: trim(params.lastname),
    firstname: trim(params.firstname),
    email: trim(params.email),
    mobile: canonicalMobile(params.mobile),
    howToContact: trim(params.howToContact),
    potential: params.potential === true,
    alreadyCame: params.alreadyCame === true,
    firstMeeting: trim(params.firstMeeting),
    commentFirstMeeting: trim(params.commentFirstMeeting),
    comment: trim(params.comment),
  })

  await sendMeetingEmail(newPostulant.email, newPostulant.firstname, newPostulant.firstMeeting)

  return {
    toDatabase: newPostulant,
    toCaller: {},
  }
})
export const postulantSet = expressAccessor.set()

function getByEmail<T extends { email: string }>(list: T[], rawEmail: string): T | undefined {
  const email = canonicalEmail(rawEmail || '')
  const volunteer = list.find(v => canonicalEmail(v.email) === email)

  return volunteer
}

async function sendMeetingEmail(email: string, firstname: string, firstMeeting: string): Promise<void> {
  const miscSheet = await getSheet<MiscWithoutId, Misc>('Miscs', new Misc(), translationMisc)
  const apiKey = import.meta.env.SENDGRID_API_KEY || ''

  const miscList = await miscSheet.getList()

  if (!miscList) {
    throw new Error('Unable to load miscList')
  }

  const hasMeetingDates = miscList?.[0]?.meetingId !== ''

  if (!hasMeetingDates || firstMeeting === '') {
    if (IS_DEV || apiKey === '') {
      console.error(`Fake sending meeting email to ${email}`)
    } else {
      sgMail.setApiKey(apiKey)
      const visioComment = firstMeeting === 'visio' ? ' en visio' : ''
      const msg = {
        to: email,
        from: 'contact@parisestludique.fr',
        subject: 'Première rencontre Paris est Ludique',
        text: `Salut ${firstname},\n\nTon inscription est bien prise en compte !\n\nNous te contacterons pour trouver un moyen de se rencontrer${visioComment}.\n\nÀ bientôt :)\nPierre`,
        html: `Salut ${firstname},<br /><br />Ton inscription est bien prise en compte !<br /><br />Nous te contacterons pour trouver un moyen de se rencontrer${visioComment}.<br /><br />À bientôt :)<br />Pierre`,
      }

      await sgMail.send(msg)
    }

    return
  }

  // else

  const meetingLine = miscList.find(misc => misc.meetingId === firstMeeting)

  if (!meetingLine) {
    throw new Error(`Unable to find meeting ${firstMeeting}`)
  }

  const { meetingTitle, meetingUrl } = meetingLine

  if (IS_DEV || apiKey === '') {
    console.error(`Fake sending meeting email to ${email} for ${meetingTitle} and url ${meetingUrl}`)
  } else {
    sgMail.setApiKey(apiKey)
    const msg = {
      to: email,
      from: 'contact@parisestludique.fr',
      subject: 'Première rencontre Paris est Ludique',
      text: `Salut ${firstname},\n\nNous t'attendons bien le ${meetingTitle} (${meetingUrl}) avec d'autres nouveaux comme toi et quelques bénévoles expérimentés pour parler du festival, du bénévolat, et surtout faire connaissance !\nSi tu as un empêchement, il nous serait vraiment utile de le savoir pour éviter de faire se déplacer l'un d'eux inutilement. Tu peux nous en prévenir en répondant à cet email.\n\nVivement qu'on se rencontre :)\nÀ bientôt,\nPierre`,
      html: `Salut ${firstname},<br /><br />Nous t'attendons bien le <a target="_blank" href="${meetingUrl}">${meetingTitle}</a> avec d'autres nouveaux comme toi et quelques bénévoles expérimentés pour parler du festival, du bénévolat, et surtout faire connaissance !<br />Si tu as un empêchement, il nous serait vraiment utile de le savoir pour éviter de faire se déplacer l'un d'eux inutilement. Tu peux nous en prévenir en répondant à cet email.<br /><br />Vivement qu'on se rencontre :)<br />À bientôt,<br />Pierre`,
    }

    await sgMail.send(msg)
  }
}
