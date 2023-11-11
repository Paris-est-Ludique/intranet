import path from 'node:path'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { Router } from 'express'
import { secure } from '@/server/secure'

import { announcementListGet } from '@/server/gsheets/announcements'
import { detailedBoxListGet } from '@/server/gsheets/boxes'
import {
  gameDetailsUpdate,
  gameListGet,
  gameTitleOrderCategories,
  gameWithVolunteersListGet,
  gamesToGiveListGet,
} from '@/server/gsheets/games'
import { postulantAdd } from '@/server/gsheets/postulants'
import { teamListGet } from '@/server/gsheets/teams'
import {
  volunteerAddNew,
  volunteerAsksSet,
  volunteerDayWishesSet,
  volunteerDetailedKnowledgeList,
  volunteerDiscordId,
  volunteerForgot,
  volunteerHostingSet,
  volunteerKnowledgeSet,
  volunteerListGet,
  volunteerLoanSet,
  volunteerLogin,
  volunteerMealsSet,
  volunteerOnSiteInfo,
  volunteerParticipationDetailsSet,
  volunteerPersonalInfoSet,
  volunteerSet,
  volunteerTeamAssignSet,
  volunteerTeamWishesSet,
} from '@/server/gsheets/volunteers'
import { wishAdd, wishListGet } from '@/server/gsheets/wishes'
import { miscDiscordInvitation, miscFestivalDateListGet, miscMeetingDateListGet } from '@/server/gsheets/miscs'
import { retexSet } from '@/server/gsheets/retex'
import { notificationsSubscribe } from '@/server/notifications'

// import { /* discordRegisterCommands, */ discordBot, hasDiscordAccess } from "./discordBot"

// Google Sheets API

function defaultController(): Router {
  const router = Router()

  router.get('/GameDetailsUpdate', gameDetailsUpdate)
  router.get('/BoxDetailedListGet', detailedBoxListGet)
  router.get('/GameListGet', gameListGet)
  router.get('/GamesToGiveListGet', gamesToGiveListGet)
  router.get('/GameTitleOrderCategories', gameTitleOrderCategories)
  router.get('/MiscFestivalDateListGet', miscFestivalDateListGet)
  router.get('/MiscMeetingDateListGet', miscMeetingDateListGet)
  router.get('/WishListGet', wishListGet)
  router.post('/WishAdd', wishAdd)
  router.post('/PostulantAdd', postulantAdd)

  // Disabling registration router.post("/VolunteerPartialAdd", volunteerPartialAdd)

  router.post('/VolunteerLogin', volunteerLogin)
  router.post('/VolunteerForgot', volunteerForgot)

  return router
}

// Secured APIs

function securedController(): Router {
  const router = Router()

  router.get('/AnnouncementListGet', secure as RequestHandler, announcementListGet)
  router.get('/GameWithVolunteersListGet', secure as RequestHandler, gameWithVolunteersListGet)
  router.get('/MiscDiscordInvitationGet', secure as RequestHandler, miscDiscordInvitation)
  router.post('/RetexSet', secure as RequestHandler, retexSet)
  router.get('/TeamListGet', teamListGet)
  router.get('/VolunteerListGet', secure as RequestHandler, volunteerListGet)
  router.get('/VolunteerDiscordId', secure as RequestHandler, volunteerDiscordId)
  router.post('/VolunteerAsksSet', secure as RequestHandler, volunteerAsksSet)
  router.post('/VolunteerKnowledgeSet', secure as RequestHandler, volunteerKnowledgeSet)
  router.post('/VolunteerDetailedKnowledgeListGet', secure as RequestHandler, volunteerDetailedKnowledgeList)
  router.post('/VolunteerLoanSet', secure as RequestHandler, volunteerLoanSet)
  router.post('/VolunteerParticipationDetailsSet', secure as RequestHandler, volunteerParticipationDetailsSet)
  router.post('/VolunteerDayWishesSet', secure as RequestHandler, volunteerDayWishesSet)
  router.post('/VolunteerHostingSet', secure as RequestHandler, volunteerHostingSet)
  router.post('/VolunteerMealsSet', secure as RequestHandler, volunteerMealsSet)
  router.post('/VolunteerPersonalInfoSet', secure as RequestHandler, volunteerPersonalInfoSet)
  router.post('/VolunteerTeamWishesSet', secure as RequestHandler, volunteerTeamWishesSet)
  router.post('/VolunteerTeamAssignSet', secure as RequestHandler, volunteerTeamAssignSet)
  router.get('/VolunteerOnSiteInfo', secure as RequestHandler, volunteerOnSiteInfo)

  // Admin only

  router.post('/VolunteerAddNew', secure as RequestHandler, volunteerAddNew)
  router.post('/VolunteerSet', secure as RequestHandler, volunteerSet)

  // Push notification subscription

  router.post('/notifications/subscribe', notificationsSubscribe)

  return router
}

function dbDownloadController(): Router {
  // Anonymized DB download

  const router = Router()

  router.get(
    '/OUpere3yzML8da8abw5Tyeef2P0LJOetmdDHfKZC0T2CU/dbAnonymized.json',
    async (_request: Request, response: Response, _next: NextFunction): Promise<void> => {
      const file = path.resolve(`access/dbAnonymized.json`)

      response.download(file)
    },
  )

  return router
}

export default (): Router => {
  const router = Router()

  router.use('/api', [defaultController(), securedController(), dbDownloadController()])

  return router
}
