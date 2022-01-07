/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { volunteerExample } from "../../../services/volunteers"

import VolunteerInfo from "../index"

describe("<VolunteerInfo />", () => {
    it("renders", () => {
        const tree = render(
            <MemoryRouter>
                <VolunteerInfo item={volunteerExample} />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
