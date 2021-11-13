/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import mockStore from "../../../utils/mockStore"
import UserInfo from "../UserInfo"

describe("<UserInfo />", () => {
    const mockData = {
        memberId: 1,
        name: "PeL",
        phone: "+886 0970...",
        email: "forceoranj@gmail.com",
        website: "https://www.parisestludique.fr",
    }
    const { memberId } = mockData

    const renderHelper = (reducer = {}) => {
        const { dispatch, ProviderWithStore } = mockStore({ userData: reducer })
        const { container } = render(
            <ProviderWithStore>
                <MemoryRouter>
                    {/*
            @ts-expect-error */}
                    <UserInfo match={{ params: { memberId } }} />
                </MemoryRouter>
            </ProviderWithStore>
        )

        return { dispatch, firstChild: container.firstChild }
    }

    it("renders the loading status if data invalid", () => {
        expect(renderHelper().firstChild).toMatchSnapshot()
    })

    it("renders the loading status if requesting data", () => {
        const reducer = { readyStatus: "request" }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })

    it("renders an error if loading failed", () => {
        const reducer = { readyStatus: "failure" }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })

    it("renders the <Info /> if loading was successful", () => {
        const reducer = { readyStatus: "success", entity: mockData }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })
})
