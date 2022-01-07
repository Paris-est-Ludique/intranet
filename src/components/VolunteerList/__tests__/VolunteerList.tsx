/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import { volunteerExample } from "../../../services/volunteers"
import VolunteerList from "../index"

describe("<VolunteerList />", () => {
    it("renders", () => {
        const tree = render(
            <MemoryRouter>
                <VolunteerList items={[volunteerExample]} />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
