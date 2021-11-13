/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import List from "../index"

describe("<List />", () => {
    it("renders", () => {
        const tree = render(
            <MemoryRouter>
                <List
                    items={[
                        {
                            membreId: 1,
                            name: "PeL",
                            phone: "+886 0970...",
                            email: "forceoranj@gmail.com",
                            website: "https://www.parisestludique.fr",
                        },
                    ]}
                />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
