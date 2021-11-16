import axios from "axios"

import mockStore from "../../utils/mockStore"
import membre, { getRequesting, getSuccess, getFailure, fetchMembre, initialState } from "../membre"

jest.mock("axios")

const mockData = {
    id: 1,
    nom: "Aupeix",
    prenom: "Amélie",
    mail: "pakouille.lakouille@yahoo.fr",
    telephone: "0675650392",
    photo: "images/membres/$taille/amélie_aupeix.jpg",
    alimentation: "Végétarien",
    majeur: 1,
    privilege: 0,
    actif: 0,
    commentaire: "",
    horodatage: "0000-00-00",
    passe: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPlobkyRrNIal8ASimSjNj4SR.9O",
}
const { id } = mockData
const mockError = "Oops! Something went wrong."

describe("membre reducer", () => {
    it("should handle initial state correctly", () => {
        // @ts-expect-error
        expect(membre(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(membre(undefined, { type: getRequesting.type, payload: id })).toEqual({
            readyStatus: "request",
        })
    })

    it("should handle success correctly", () => {
        expect(
            membre(undefined, {
                type: getSuccess.type,
                payload: mockData,
            })
        ).toEqual({ readyStatus: "success", entity: mockData })
    })

    it("should handle failure correctly", () => {
        expect(
            membre(undefined, {
                type: getFailure.type,
                payload: mockError,
            })
        ).toEqual({ readyStatus: "failure", error: mockError })
    })
})

describe("membre action", () => {
    it("fetches membre data successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchMembre(id))
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches membre data failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchMembre(id))
        expect(getActions()).toEqual(expectedActions)
    })
})
