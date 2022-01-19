import { checkGSheetsAccess } from "./gsheets/accessors"

export default async function checkAccess(): Promise<void> {
    checkGSheetsAccess()
}
