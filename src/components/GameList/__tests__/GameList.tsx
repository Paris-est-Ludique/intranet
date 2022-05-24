/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import mockStore from "../../../utils/mockStore"
import GameList from "../index"

describe("<List />", () => {
    const renderHelper = (reducer = { readyStatus: "idle" }) => {
        const { dispatch, ProviderWithStore } = mockStore({ gameList: reducer })
        const { container } = render(
            <ProviderWithStore>
                <MemoryRouter>
                    <GameList ids={[5]} />
                </MemoryRouter>
            </ProviderWithStore>
        )

        return { dispatch, firstChild: container.firstChild }
    }

    it("renders", () => {
        const reducer = {
            readyStatus: "success",
            ids: [5],
            entities: {
                "5": {
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
            },
        }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })
})
