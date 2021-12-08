/**
 * @jest-environment jsdom
 */

import _ from "lodash"
import { getAccessors } from "../../gsheets/accessors"
import { login } from "../login"

// Could do a full test with: wget --header='Content-Type:application/json' --post-data='{"email":"pikiou.sub@gmail.com","password":"mot de passe"}' http://localhost:3000/api/user/login

// Full test with Bearer: wget --header='Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicGlraW91c3ViQGdlYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNjM4MjUzODgzLCJleHAiOjE2Mzg4NTg2ODN9.MknJ4NfcVlgW2ODeimfwZI1a4z8asdEXtHwHgViy6c4' http://localhost:3000/VolunteerGet?id=1

const mockUser = {
    email: "my.email@gmail.com",
    password: "$2y$10$cuKFHEow2IVSZSPtoVsw6uZFNFOOP/v1V7fubbyvrxhZdsnxLHr.2",
    firstname: "monPrénom",
}

jest.mock("../../gsheets/accessors")

describe("login with", () => {
    beforeAll(() => {
        ;(getAccessors as jest.Mock).mockImplementation(() => ({
            listGet: () => [mockUser],
        }))
    })

    it("right password", async () => {
        const res = await login("my.email@gmail.com", "12345678")
        expect(_.omit(res, "jwt")).toEqual({
            volunteer: {
                firstname: mockUser.firstname,
            },
        })
        expect(res.jwt).toBeDefined()
    })

    it("invalid password length", async () => {
        await expect(login("my.email@gmail.com", "123")).rejects.toThrow("Mot de passe trop court")
    })

    it("empty password", async () => {
        await expect(login("my.email@gmail.com", " ")).rejects.toThrow("Mot de passe nécessaire")
    })

    it("wrong password", async () => {
        await expect(login("my.email@gmail.com", "1234567891011")).rejects.toThrow(
            "Mauvais mot de passe pour cet email"
        )
    })

    it("invalid email format", async () => {
        await expect(login("my.email@gmail", "12345678")).rejects.toThrow("Email invalid")
    })

    it("empty email", async () => {
        await expect(login("    ", "12345678")).rejects.toThrow("Email invalid")
    })

    it("unknown email", async () => {
        await expect(login("mon.emailBidon@gmail.com", "12345678")).rejects.toThrow(
            "Cet email ne correspond à aucun utilisateur"
        )
    })
})
