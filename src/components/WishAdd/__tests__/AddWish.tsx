/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import WishAdd from "../index"

describe("<WishAdd />", () => {
    it("renders", () => {
        const dispatch = jest.fn()
        const tree = render(
            <MemoryRouter>
                <WishAdd dispatch={dispatch} />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
