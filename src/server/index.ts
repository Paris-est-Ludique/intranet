import path from "path"
import express, { RequestHandler, Request, Response, NextFunction } from "express"
import logger from "morgan"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet from "helmet"
import hpp from "hpp"
import favicon from "serve-favicon"
import chalk from "chalk"
import * as http from "http"

import devServer from "./devServer"
import ssr from "./ssr"

import { hasSecret, secure } from "./secure"
import { announcementListGet } from "./gsheets/announcements"
import { detailedBoxListGet } from "./gsheets/boxes"
import {
    gameListGet,
    gameDetailsUpdate,
    gameWithVolunteersListGet,
    gamesToGiveListGet,
    gameTitleOrderCategories,
} from "./gsheets/games"
import { postulantAdd } from "./gsheets/postulants"
import { teamListGet } from "./gsheets/teams"
import {
    volunteerAsksSet,
    volunteerDayWishesSet,
    volunteerForgot,
    volunteerHostingSet,
    volunteerMealsSet,
    volunteerDiscordId,
    volunteerLogin,
    volunteerParticipationDetailsSet,
    volunteerPersonalInfoSet,
    volunteerSet,
    volunteerTeamWishesSet,
    volunteerTeamAssignSet,
    volunteerListGet,
    volunteerKnowledgeSet,
    volunteerAddNew,
    volunteerDetailedKnowledgeList,
    volunteerLoanSet,
    volunteerOnSiteInfo,
} from "./gsheets/volunteers"
import { wishListGet, wishAdd } from "./gsheets/wishes"
import { /* discordRegisterCommands, */ discordBot, hasDiscordAccess } from "./discordBot"
import checkAccess from "./checkAccess"
import { hasGSheetsAccess } from "./gsheets/accessors"
import { addStatus } from "./status"
import {
    miscDiscordInvitation,
    miscFestivalDateListGet,
    miscMeetingDateListGet,
} from "./gsheets/miscs"
import { retexSet } from "./gsheets/retex"

checkAccess()

// discordRegisterCommands()
discordBot()

const { PORT } = process.env

const app = express()

// Allow receiving big images
app.use(express.json({ limit: "200mb" }))
app.use(express.urlencoded({ limit: "200mb" }))

// Use helmet to secure Express with various HTTP headers
app.use(helmet({ contentSecurityPolicy: false }))
// Prevent HTTP parameter pollution
app.use(hpp())
// Compress all requests
app.use(compression())

// Use for http request debug (show errors only)
app.use(logger("dev", { skip: (_req, res) => res.statusCode < 400 }))
app.use(favicon(path.resolve(process.cwd(), "public/favicon.ico")))
app.use(express.static(path.resolve(process.cwd(), "public")))

// Enable dev-server in development
if (DEV) devServer(app)

app.use(express.json())
app.use(cookieParser())

// Anonymized DB download
app.get(
    "/OUpere3yzML8da8abw5Tyeef2P0LJOetmdDHfKZC0T2CU/dbAnonymized.json",
    async (_request: Request, response: Response, _next: NextFunction): Promise<void> => {
        const file = path.resolve(`access/dbAnonymized.json`)
        response.download(file)
    }
)

const apiRouter = express.Router()

/**
 * APIs
 */
// Google Sheets API
apiRouter.get("/GameDetailsUpdate", gameDetailsUpdate)
apiRouter.get("/BoxDetailedListGet", detailedBoxListGet)
apiRouter.get("/GameListGet", gameListGet)
apiRouter.get("/GamesToGiveListGet", gamesToGiveListGet)
apiRouter.get("/GameTitleOrderCategories", gameTitleOrderCategories)
apiRouter.get("/MiscFestivalDateListGet", miscFestivalDateListGet)
apiRouter.get("/MiscMeetingDateListGet", miscMeetingDateListGet)
apiRouter.get("/WishListGet", wishListGet)
apiRouter.post("/WishAdd", wishAdd)
apiRouter.post("/PostulantAdd", postulantAdd)
// Disabling registration apiRouter.post("/VolunteerPartialAdd", volunteerPartialAdd)
apiRouter.post("/VolunteerLogin", volunteerLogin)
apiRouter.post("/VolunteerForgot", volunteerForgot)
apiRouter.get("/VolunteerListGet", secure as RequestHandler, volunteerListGet)

// Secured APIs
apiRouter.get("/AnnouncementListGet", secure as RequestHandler, announcementListGet)
apiRouter.get("/GameWithVolunteersListGet", secure as RequestHandler, gameWithVolunteersListGet)
apiRouter.get("/MiscDiscordInvitationGet", secure as RequestHandler, miscDiscordInvitation)
apiRouter.post("/RetexSet", secure as RequestHandler, retexSet)
apiRouter.get("/TeamListGet", teamListGet)
apiRouter.get("/VolunteerDiscordId", secure as RequestHandler, volunteerDiscordId)
apiRouter.post("/VolunteerAsksSet", secure as RequestHandler, volunteerAsksSet)
apiRouter.post("/VolunteerKnowledgeSet", secure as RequestHandler, volunteerKnowledgeSet)
apiRouter.post(
    "/VolunteerDetailedKnowledgeListGet",
    secure as RequestHandler,
    volunteerDetailedKnowledgeList
)
apiRouter.post("/VolunteerLoanSet", secure as RequestHandler, volunteerLoanSet)
apiRouter.post(
    "/VolunteerParticipationDetailsSet",
    secure as RequestHandler,
    volunteerParticipationDetailsSet
)
apiRouter.post("/VolunteerDayWishesSet", secure as RequestHandler, volunteerDayWishesSet)
apiRouter.post("/VolunteerHostingSet", secure as RequestHandler, volunteerHostingSet)
apiRouter.post("/VolunteerMealsSet", secure as RequestHandler, volunteerMealsSet)
apiRouter.post("/VolunteerPersonalInfoSet", secure as RequestHandler, volunteerPersonalInfoSet)
apiRouter.post("/VolunteerTeamWishesSet", secure as RequestHandler, volunteerTeamWishesSet)
apiRouter.post("/VolunteerTeamAssignSet", secure as RequestHandler, volunteerTeamAssignSet)
apiRouter.get("/VolunteerOnSiteInfo", secure as RequestHandler, volunteerOnSiteInfo)

// Admin only
apiRouter.post("/VolunteerAddNew", secure as RequestHandler, volunteerAddNew)
apiRouter.post("/VolunteerSet", secure as RequestHandler, volunteerSet)

app.use("/api", apiRouter)

// Use React server-side rendering middleware
app.get("*", ssr)

/**
 * Listen on provided port, on all network interfaces.
 */

const server = http.createServer(app)

server.listen(PORT)
server.on("error", (error) => {
    if (error) {
        addStatus("Server listening:", chalk.red(`==> 😭  OMG!!! ${error}`))
    }
})
server.on("listening", () => {
    const addr = server.address()
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`
    addStatus("Server listening:", chalk.green(`✅ ${bind}`))
})

hasGSheetsAccess().then((hasApiAccess: boolean) => {
    if (hasApiAccess) {
        addStatus("Database:", chalk.green(`✅ online from Google Sheet`))
    } else {
        addStatus("Database:", chalk.blue(`🚧 offline, simulated from local db file`))
    }
})

const hasSendGridApiAccess = !!process.env.SENDGRID_API_KEY
if (hasSendGridApiAccess) {
    addStatus("Emailing:", chalk.green(`✅ online through SendGrid`))
} else {
    addStatus("Emailing:", chalk.blue(`🚧 offline, simulated`))
}

hasDiscordAccess().then((hasApiAccess: boolean) => {
    if (hasApiAccess) {
        addStatus("Discord bot:", chalk.green(`✅ online through discord.js`))
    } else {
        addStatus("Discord bot:", chalk.blue(`🚧 no creds, disabled`))
    }
})

hasSecret().then((has: boolean) => {
    if (has) {
        addStatus("JWT secret:", chalk.green(`✅ prod private one from file`))
    } else {
        addStatus("JWT secret:", chalk.blue(`🚧 dev public fake one from config`))
    }
})
