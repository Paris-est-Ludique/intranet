import path from "path"
import fs from "fs"
import readline from "readline"
import _ from "lodash"
import { google } from "googleapis"
import config from "../config"

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
const TOKEN_PATH = path.resolve(process.cwd(), "access/token.json")
const CRED_PATH = path.resolve(process.cwd(), "access/gsheets.json")

export const getList = async <T>(sheetName: string): Promise<T[] | undefined> => {
    const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, "utf8")))
    const sheets = google.sheets({ version: "v4", auth })
    const r = await sheets.spreadsheets.values.get({
        spreadsheetId: config.GOOGLE_SHEET_ID,
        range: `${sheetName}!A1:Z`,
    })

    if (_.isArray(r?.data?.values)) {
        const rows = r.data.values as string[][]
        const keys: string[] = rows[0]
        rows.shift()
        const list: T[] = _.map(
            rows,
            (row) =>
                _.reduce(
                    row,
                    (game: any, val: any, collumn: number) => {
                        game[keys[collumn]] = val
                        return game
                    },
                    {}
                ) as T
        )
        return list
    }
    return undefined
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

export { SCOPES }
