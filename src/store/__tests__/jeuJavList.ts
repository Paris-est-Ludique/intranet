import axios from "axios"

import mockStore from "../../utils/mockStore"
import JeuJavList, {
    initialState,
    getRequesting,
    getSuccess,
    getFailure,
    fetchJeuJavList,
} from "../jeuJavList"

jest.mock("axios")

const mockData = {
    "5": {
        id: 5,
        titre: "6 qui prend!",
        auteur: "Wolfgang Kramer",
        editeur: "(uncredited) , Design Edge , B",
        minJoueurs: 2,
        maxJoueurs: 10,
        duree: 45,
        type: "Ambiance",
        poufpaf: "0-9-2/6-qui-prend-6-nimmt",
        photo: "https://cf.geekdo-images.com/thumb/img/lzczxR5cw7an7tRWeHdOrRtLyes=/fit-in/200x150/pic772547.jpg",
        bggPhoto: "",
        bggId: 432,
        exemplaires: 1,
        dispoPret: 1,
        nonRangee: 0,
        horodatage: "0000-00-00",
        ean: "3421272101313",
    },
}
const mockError = "Oops! Something went wrong."

describe("JeuJavList reducer", () => {
    it("should handle initial state", () => {
        // @ts-expect-error
        expect(JeuJavList(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(JeuJavList(undefined, { type: getRequesting.type })).toEqual({
            readyStatus: "request",
            ids: [],
            entities: {},
        })
    })

    it("should handle success correctly", () => {
        expect(JeuJavList(undefined, { type: getSuccess.type, payload: mockData })).toEqual({
            ...initialState,
            readyStatus: "success",
            ids: [5],
            entities: mockData,
        })
    })

    it("should handle failure correctly", () => {
        expect(JeuJavList(undefined, { type: getFailure.type, payload: mockError })).toEqual({
            ...initialState,
            readyStatus: "failure",
            error: mockError,
        })
    })
})

describe("JeuJavList action", () => {
    it("fetches JeuJav list successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchJeuJavList())
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches JeuJav list failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchJeuJavList())
        expect(getActions()).toEqual(expectedActions)
    })
})
