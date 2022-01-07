/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { volunteerExample } from "../../../services/volunteers"

import VolunteerSet from "../index"

describe("<SetVolunteer />", () => {
    it("renders", () => {
        const dispatch = jest.fn()
        const tree = render(
            <MemoryRouter>
                <VolunteerSet dispatch={dispatch} volunteer={volunteerExample} />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
