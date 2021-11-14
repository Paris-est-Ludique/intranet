import axios from "axios"

import mockStore from "../../utils/mockStore"
import membreList, {
    initialState,
    getRequesting,
    getSuccess,
    getFailure,
    fetchMembreList,
} from "../membreList"

jest.mock("axios")

const mockData = {
    "1": {
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
    },
}
const mockError = "Oops! Something went wrong."

describe("membreList reducer", () => {
    it("should handle initial state", () => {
        // @ts-expect-error
        expect(membreList(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(membreList(undefined, { type: getRequesting.type })).toEqual({
            readyStatus: "request",
            ids: [],
            entities: {},
        })
    })

    it("should handle success correctly", () => {
        expect(membreList(undefined, { type: getSuccess.type, payload: mockData })).toEqual({
            ...initialState,
            readyStatus: "success",
            ids: [1],
            entities: mockData,
        })
    })

    it("should handle failure correctly", () => {
        expect(membreList(undefined, { type: getFailure.type, payload: mockError })).toEqual({
            ...initialState,
            readyStatus: "failure",
            error: mockError,
        })
    })
})

describe("membreList action", () => {
    it("fetches membre list successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchMembreList())
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches membre list failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchMembreList())
        expect(getActions()).toEqual(expectedActions)
    })
})
