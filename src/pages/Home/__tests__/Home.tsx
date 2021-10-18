/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import { fetchJeuxJavListIfNeed } from "../../../store/jeuxJavList"
import mockStore from "../../../utils/mockStore"
import Home from "../Home"

describe("<Home />", () => {
    const renderHelper = (reducer = { readyStatus: "invalid" }) => {
        const { dispatch, ProviderWithStore } = mockStore({ jeuxJavList: reducer })
        const { container } = render(
            <ProviderWithStore>
                <MemoryRouter>
                    {/*
            @ts-expect-error */}
                    <Home />
                </MemoryRouter>
            </ProviderWithStore>
        )

        return { dispatch, firstChild: container.firstChild }
    }

    it("should fetch data when page loaded", () => {
        const { dispatch } = renderHelper()

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch.mock.calls[0][0].toString()).toBe(fetchJeuxJavListIfNeed().toString())
    })

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

    it("renders the <List /> if loading was successful", () => {
        const reducer = {
            readyStatus: "success",
            items: [
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
            ],
        }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })
})
