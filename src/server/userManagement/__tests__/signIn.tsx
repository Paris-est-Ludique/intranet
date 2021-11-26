/**
 * @jest-environment jsdom
 */

import { signIn } from "../signIn"

// Could do a full test with wget --header='Content-Type:application/json' --post-data='{"email":"pikiou.sub@gmail.com","password":"mot de passe"}' http://localhost:3000/api/user/login

const mockUser = {
    mail: "my.email@gmail.com",
    passe: "$2y$10$cuKFHEow2IVSZSPtoVsw6uZFNFOOP/v1V7fubbyvrxhZdsnxLHr.2",
    prenom: "monPrénom",
}

jest.mock("../../gsheets/accessors", () => () => ({
    listGet: () => [mockUser],
}))

describe("signIn with", () => {
    it("right password", async () => {
        const res = await signIn("my.email@gmail.com", "12345678")
        expect(res).toEqual({
            membre: {
                prenom: mockUser.prenom,
            },
        })
    })

    it("invalid password length", async () => {
        await expect(signIn("my.email@gmail.com", "123")).rejects.toThrow("Mot de passe trop court")
    })

    it("empty password", async () => {
        await expect(signIn("my.email@gmail.com", " ")).rejects.toThrow("Mot de passe nécessaire")
    })

    it("wrong password", async () => {
        await expect(signIn("my.email@gmail.com", "1234567891011")).rejects.toThrow(
            "Mauvais mot de passe pour cet email"
        )
    })

    it("invalid email format", async () => {
        await expect(signIn("my.email@gmail", "12345678")).rejects.toThrow("Email invalid")
    })

    it("empty email", async () => {
        await expect(signIn("    ", "12345678")).rejects.toThrow("Email invalid")
    })

    it("unknown email", async () => {
        await expect(signIn("mon.emailBidon@gmail.com", "12345678")).rejects.toThrow(
            "Cet email ne correspond à aucun utilisateur"
        )
    })
})
