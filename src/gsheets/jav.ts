import path from "path"
import fs from "fs"
import readline from "readline"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { google } from "googleapis"
import config from "../config"

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
const TOKEN_PATH = path.resolve(process.cwd(), "access/token.json")
const CRED_PATH = path.resolve(process.cwd(), "access/gsheets.json")

// eslint-disable-next-line no-unused-vars
export const getJAVGameList = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")))
    const sheets = google.sheets({ version: "v4", auth })
    const r = await sheets.spreadsheets.values.get({
        spreadsheetId: config.GOOGLE_SHEET_ID,
        range: "JAV Games!A1:Z",
    })

    if (_.isArray(r?.data?.values)) {
        const list = _.map(r.data.values, (val: any) => ({
            id: val[0],
            titre: val[1],
        }))
        response.status(200).json(list)
    }
    // if (r?.data?.values) {
    //   const rows: JAVGame[] = r.data.values as JAVGame[]
    //   if (rows) {
    //     if (rows.length) {
    //       console.log('Name, Major:')
    //       // Print columns A and E, which correspond to indices 0 and 4.
    //       rows.map((row) => {
    //         console.log(`${row[0]}, ${row[4]}`)
    //       })
    //       return { data: rows }
    //     } else {
    //       console.log('No data found.')
    //     }
    //   }
    // }
}

// eslint-disable-next-line no-unused-vars
export const getJAVGameData = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    console.log("CRED_PATH", CRED_PATH)
    console.log("fs.readFileSync(CRED_PATH, 'utf8')")
    const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")))
    const sheets = google.sheets({ version: "v4", auth })
    const r = await sheets.spreadsheets.values.get({
        spreadsheetId: "1pMMKcYx6NXLOqNn6pLHJTPMTOLRYZmSNg2QQcAu7-Pw",
        range: "Ongoing!A1:T",
    })

    console.log("r?.data?.values", r?.data?.values)
    response.status(200).json(r?.data?.values)
    // if (r?.data?.values) {
    //   const rows: JAVGame[] = r.data.values as JAVGame[]
    //   if (rows) {
    //     if (rows.length) {
    //       console.log('Name, Major:')
    //       // Print columns A and E, which correspond to indices 0 and 4.
    //       rows.map((row) => {
    //         console.log(`${row[0]}, ${row[4]}`)
    //       })
    //       return { data: rows }
    //     } else {
    //       console.log('No data found.')
    //     }
    //   }
    // }
}

async function authorize(cred: any) {
    const {
        client_secret: clientSecret,
        client_id: clientId,
        redirect_uris: redirectUris,
    } = cred.web
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[0])

    if (fs.existsSync(TOKEN_PATH)) {
        oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")))
        return oAuth2Client
    }

    return getNewToken<typeof oAuth2Client>(oAuth2Client)
}

async function getNewToken<T = any>(oAuth2Client: any): Promise<T> {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    })

    console.log("Authorize this app by visiting this url:", authUrl)
    const code = await readlineAsync("Enter the code from that page here: ")
    const token = await new Promise((resolve, reject) => {
        oAuth2Client.getToken(code, (err: any, _token: any) =>
            err ? reject(err) : resolve(_token)
        )
    })
    oAuth2Client.setCredentials(token)
    // Store the token to disk for later program executions
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
    console.log("Token stored to", TOKEN_PATH)

    return oAuth2Client
}

async function readlineAsync(question: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close()
            resolve(answer)
        })
    })
}
