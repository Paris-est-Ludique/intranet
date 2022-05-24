import axios from "axios"
import _ from "lodash"

import mockStore from "../../utils/mockStore"
import GameList, {
    initialState,
    getRequesting,
    getSuccess,
    getFailure,
    fetchGameList,
} from "../gameList"
import { Game } from "../../services/games"

jest.mock("axios")

const mockData: Game[] = [
    {
        id: 5,
        title: "6 qui prend!",
        playersMin: 2,
        playersMax: 10,
        duration: 45,
        type: "Ambiance",
        poufpaf: "0-9-2/6-qui-prend-6-nimmt",
        bggPhoto:
            "https://cf.geekdo-images.com/thumb/img/lzczxR5cw7an7tRWeHdOrRtLyes=/fit-in/200x150/pic772547.jpg",
        bggId: 432,
        ean: "3421272101313",
    },
]
const mockError = "Oops! Something went wrong."

describe("GameList reducer", () => {
    it("should handle initial state", () => {
        // @ts-expect-error
        expect(GameList(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(GameList(undefined, { type: getRequesting.type })).toEqual({
            readyStatus: "request",
            ids: [],
            entities: {},
        })
    })

    it("should handle success correctly", () => {
        expect(GameList(undefined, { type: getSuccess.type, payload: mockData })).toEqual({
            ...initialState,
            readyStatus: "success",
            ids: _.map(mockData, "id"),
            entities: _.keyBy(mockData, "id"),
        })
    })

    it("should handle failure correctly", () => {
        expect(GameList(undefined, { type: getFailure.type, payload: mockError })).toEqual({
            ...initialState,
            readyStatus: "failure",
            error: mockError,
        })
    })
})

describe("GameList action", () => {
    it("fetches Game list successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type, payload: undefined },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchGameList())
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches Game list failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchGameList())
        expect(getActions()).toEqual(expectedActions)
    })
})
