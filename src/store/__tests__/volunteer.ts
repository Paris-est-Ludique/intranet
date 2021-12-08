import axios from "axios"

import mockStore from "../../utils/mockStore"
import volunteer, {
    getRequesting,
    getSuccess,
    getFailure,
    fetchVolunteer,
    initialState,
} from "../volunteer"
import { Volunteer } from "../../services/volunteers"

jest.mock("axios")

const mockFrenchData: any = {
    id: 1,
    nom: "Aupeix",
    prenom: "Amélie",
    mail: "pakouille.lakouille@yahoo.fr",
    telephone: "0675650392",
    photo: "images/volunteers/$taille/amélie_aupeix.jpg",
    alimentation: "Végétarien",
    majeur: 1,
    privilege: 0,
    actif: 0,
    commentaire: "",
    horodatage: "0000-00-00",
    passe: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPlobkyRrNIal8ASimSjNj4SR.9O",
}

const mockEnglishData: Volunteer = {
    id: 1,
    lastname: "Aupeix",
    firstname: "Amélie",
    email: "pakouille.lakouille@yahoo.fr",
    mobile: "0675650392",
    photo: "images/volunteers/$taille/amélie_aupeix.jpg",
    food: "Végétarien",
    adult: 1,
    privileges: 0,
    active: 0,
    comment: "",
    timestamp: "0000-00-00",
    password: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPlobkyRrNIal8ASimSjNj4SR.9O",
}
const { id } = mockEnglishData
const mockError = "Oops! Something went wrong."

describe("volunteer reducer", () => {
    it("should handle initial state correctly", () => {
        // @ts-expect-error
        expect(volunteer(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(volunteer(undefined, { type: getRequesting.type, payload: id })).toEqual({
            readyStatus: "request",
        })
    })

    it("should handle success correctly", () => {
        expect(
            volunteer(undefined, {
                type: getSuccess.type,
                payload: mockEnglishData,
            })
        ).toEqual({ readyStatus: "success", entity: mockEnglishData })
    })

    it("should handle failure correctly", () => {
        expect(
            volunteer(undefined, {
                type: getFailure.type,
                payload: mockError,
            })
        ).toEqual({ readyStatus: "failure", error: mockError })
    })
})

describe("volunteer action", () => {
    it("fetches volunteer data successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type, payload: undefined },
            { type: getSuccess.type, payload: mockEnglishData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockFrenchData })

        await dispatch(fetchVolunteer(id))
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches volunteer data failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchVolunteer(id))
        expect(getActions()).toEqual(expectedActions)
    })
})
