import axios from "axios"

import mockStore from "../../utils/mockStore"
import userData, {
    getRequesting,
    getSuccess,
    getFailure,
    fetchUserData,
    initialState,
} from "../userData"

jest.mock("axios")

const mockData = {
    membreId: 1,
    name: "PeL",
    phone: "+886 0970...",
    email: "forceoranj@gmail.com",
    website: "https://www.parisestludique.fr",
}
const { membreId } = mockData
const mockError = "Oops! Something went wrong."

describe("userData reducer", () => {
    it("should handle initial state correctly", () => {
        // @ts-expect-error
        expect(userData(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(userData(undefined, { type: getRequesting.type, payload: membreId })).toEqual({
            readyStatus: "request",
        })
    })

    it("should handle success correctly", () => {
        expect(
            userData(undefined, {
                type: getSuccess.type,
                payload: mockData,
            })
        ).toEqual({ readyStatus: "success", entity: mockData })
    })

    it("should handle failure correctly", () => {
        expect(
            userData(undefined, {
                type: getFailure.type,
                payload: mockError,
            })
        ).toEqual({ readyStatus: "failure", error: mockError })
    })
})

describe("userData action", () => {
    it("fetches user data successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchUserData(membreId))
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches user data failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchUserData(membreId))
        expect(getActions()).toEqual(expectedActions)
    })
})
