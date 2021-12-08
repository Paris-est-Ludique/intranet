import axios from "axios"
import _ from "lodash"

import mockStore from "../../utils/mockStore"
import JavGameList, {
    initialState,
    getRequesting,
    getSuccess,
    getFailure,
    fetchJavGameList,
} from "../javGameList"
import { JavGame } from "../../services/javGames"

jest.mock("axios")

const mockFrenchData: any[] = [
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
        bggPhoto:
            "https://cf.geekdo-images.com/thumb/img/lzczxR5cw7an7tRWeHdOrRtLyes=/fit-in/200x150/pic772547.jpg",
        bggId: 432,
        exemplaires: 1,
        dispoPret: 1,
        nonRangee: 0,
        ean: "3421272101313",
    },
]
const mockEnglishData: JavGame[] = [
    {
        id: 5,
        title: "6 qui prend!",
        author: "Wolfgang Kramer",
        editor: "(uncredited) , Design Edge , B",
        playersMin: 2,
        playersMax: 10,
        duration: 45,
        type: "Ambiance",
        poufpaf: "0-9-2/6-qui-prend-6-nimmt",
        bggPhoto:
            "https://cf.geekdo-images.com/thumb/img/lzczxR5cw7an7tRWeHdOrRtLyes=/fit-in/200x150/pic772547.jpg",
        bggId: 432,
        copies: 1,
        lendAvailability: 1,
        notStored: 0,
        ean: "3421272101313",
    },
]
const mockError = "Oops! Something went wrong."

describe("JavGameList reducer", () => {
    it("should handle initial state", () => {
        // @ts-expect-error
        expect(JavGameList(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(JavGameList(undefined, { type: getRequesting.type })).toEqual({
            readyStatus: "request",
            ids: [],
            entities: {},
        })
    })

    it("should handle success correctly", () => {
        expect(JavGameList(undefined, { type: getSuccess.type, payload: mockEnglishData })).toEqual(
            {
                ...initialState,
                readyStatus: "success",
                ids: _.map(mockEnglishData, "id"),
                entities: _.keyBy(mockEnglishData, "id"),
            }
        )
    })

    it("should handle failure correctly", () => {
        expect(JavGameList(undefined, { type: getFailure.type, payload: mockError })).toEqual({
            ...initialState,
            readyStatus: "failure",
            error: mockError,
        })
    })
})

describe("JavGameList action", () => {
    it("fetches JavGame list successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type, payload: undefined },
            { type: getSuccess.type, payload: mockEnglishData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockFrenchData })

        await dispatch(fetchJavGameList())
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches JavGame list failed", async () => {
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
