import axios from "axios"

import mockStore from "../../utils/mockStore"
import javGameList, {
    initialState,
    getRequesting,
    getSuccess,
    getFailure,
    fetchJavGameList,
} from "../javGameList"

jest.mock("axios")

const mockData = [
    {
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
]
const mockError = "Oops! Something went wrong."

describe("javGameList reducer", () => {
    it("should handle initial state", () => {
        // @ts-expect-error
        expect(javGameList(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(javGameList(undefined, { type: getRequesting.type })).toEqual({
            readyStatus: "request",
            items: [],
            error: null,
        })
    })

    it("should handle success correctly", () => {
        expect(javGameList(undefined, { type: getSuccess.type, payload: mockData })).toEqual({
            ...initialState,
            readyStatus: "success",
            items: mockData,
        })
    })

    it("should handle failure correctly", () => {
        expect(javGameList(undefined, { type: getFailure.type, payload: mockError })).toEqual({
            ...initialState,
            readyStatus: "failure",
            error: mockError,
        })
    })
})

describe("javGameList action", () => {
    it("fetches javGame list successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchJavGameList())
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches javGame list failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchJavGameList())
        expect(getActions()).toEqual(expectedActions)
    })
})
