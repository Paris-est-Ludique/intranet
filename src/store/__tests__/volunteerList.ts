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
import { Volunteer } from "../../services/volunteers"

jest.mock("axios")

const mockData: Volunteer[] = [
    {
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
        timestamp: new Date(0),
        password: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPlobkyRrNIal8ASimSjNj4SR.9O",
    },
]
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
