import axios from "axios"
import _ from "lodash"

import mockStore from "../../utils/mockStore"
import volunteerList, {
    initialState,
    getRequesting,
    getSuccess,
    getFailure,
    fetchVolunteerList,
} from "../volunteerList"
import { Volunteer, volunteerExample } from "../../services/volunteers"

jest.mock("axios")

const mockData: Volunteer[] = [volunteerExample]
const mockError = "Oops! Something went wrong."

describe("volunteerList reducer", () => {
    it("should handle initial state", () => {
        // @ts-expect-error
        expect(volunteerList(undefined, {})).toEqual(initialState)
    })

    it("should handle requesting correctly", () => {
        expect(volunteerList(undefined, { type: getRequesting.type })).toEqual({
            readyStatus: "request",
            ids: [],
            entities: {},
        })
    })

    it("should handle success correctly", () => {
        expect(volunteerList(undefined, { type: getSuccess.type, payload: mockData })).toEqual({
            ...initialState,
            readyStatus: "success",
            ids: _.map(mockData, "id"),
            entities: _.keyBy(mockData, "id"),
        })
    })

    it("should handle failure correctly", () => {
        expect(volunteerList(undefined, { type: getFailure.type, payload: mockError })).toEqual({
            ...initialState,
            readyStatus: "failure",
            error: mockError,
        })
    })
})

describe("volunteerList action", () => {
    it("fetches volunteer list successful", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type, payload: undefined },
            { type: getSuccess.type, payload: mockData },
        ]

        // @ts-expect-error
        axios.get.mockResolvedValue({ data: mockData })

        await dispatch(fetchVolunteerList())
        expect(getActions()).toEqual(expectedActions)
    })

    it("fetches volunteer list failed", async () => {
        const { dispatch, getActions } = mockStore()
        const expectedActions = [
            { type: getRequesting.type },
            { type: getFailure.type, payload: mockError },
        ]

        // @ts-expect-error
        axios.get.mockRejectedValue({ message: mockError })

        await dispatch(fetchVolunteerList())
        expect(getActions()).toEqual(expectedActions)
    })
})
