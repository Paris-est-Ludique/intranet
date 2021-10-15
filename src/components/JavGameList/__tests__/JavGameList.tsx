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
                    ]}
                />
            </MemoryRouter>
        ).container.firstChild

        expect(tree).toMatchSnapshot()
    })
})
