/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import AddEnvie from "../index"

describe("<AddEnvie />", () => {
    it("renders", () => {
        const dispatch = jest.fn()
        const tree = render(
            <MemoryRouter>
                <AddEnvie dispatch={dispatch} />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
