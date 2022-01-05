/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import VolunteerInfo from "../index"

describe("<VolunteerInfo />", () => {
    it("renders", () => {
        const tree = render(
            <MemoryRouter>
                <VolunteerInfo
                    item={{
                        id: 1,
                        firstname: "Aupeix",
                        lastname: "Amélie",
                        email: "pakouille.lakouille@yahoo.fr",
                        mobile: "0675650392",
                        photo: "images/volunteers/$taille/amélie_aupeix.jpg",
                        food: "Végétarien",
                        adult: 1,
                        privileges: 0,
                        active: 0,
                        created: new Date(0),
                        password1: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPkdq9d5fqpbl8ASimSjNj4SR.9O",
                        password2: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPkdq9d5fqpbl8ASimSjNj4SR.9O",
                    }}
                />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
