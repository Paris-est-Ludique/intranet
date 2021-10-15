/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import Info from "../index"

describe("<Info />", () => {
    it("renders", () => {
        const tree = render(
            <MemoryRouter>
                <Info
                    item={{
                        id: 1,
                        name: "PeL",
                        phone: "+886 0970...",
                        email: "forceoranj@gmail.com",
                        website: "https://www.parisestludique.fr",
                    }}
                />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
