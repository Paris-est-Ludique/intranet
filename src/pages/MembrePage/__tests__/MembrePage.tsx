/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import { fetchMembreIfNeed } from "../../../store/membre"
import mockStore from "../../../utils/mockStore"
import MembrePage from "../MembrePage"

describe("<MembrePage />", () => {
    const mockData = {
        id: 1,
        nom: "Aupeix",
        prenom: "Amélie",
        mail: "pakouille.lakouille@yahoo.fr",
        telephone: "0675650392",
        photo: "images/membres/$taille/amélie_aupeix.jpg",
        alimentation: "Végétarien",
        majeur: 1,
        privilege: 0,
        actif: 0,
        commentaire: "",
        horodatage: "0000-00-00",
        passe: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPlobkyRrNIal8ASimSjNj4SR.9O",
    }
    const { id } = mockData

    const renderHelper = (reducer = {}) => {
        const { dispatch, ProviderWithStore } = mockStore({ membre: reducer })
        const { container } = render(
            <ProviderWithStore>
                <MemoryRouter>
                    {/*
            @ts-expect-error */}
                    <MembrePage match={{ params: { id } }} />
                </MemoryRouter>
            </ProviderWithStore>
        )

        return { dispatch, firstChild: container.firstChild }
    }

    it("should fetch data when page loaded", () => {
        const { dispatch } = renderHelper()

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch.mock.calls[0][0].toString()).toBe(fetchMembreIfNeed(id).toString())
    })

    it("renders the loading status if data invalid", () => {
        expect(renderHelper().firstChild).toMatchSnapshot()
    })

    it("renders the loading status if requesting data", () => {
        const reducer = { readyStatus: "request" }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })

    it("renders an error if loading failed", () => {
        const reducer = { readyStatus: "failure" }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })

    it("renders the <Info /> if loading was successful", () => {
        const reducer = { readyStatus: "success", entity: mockData }

        expect(renderHelper(reducer).firstChild).toMatchSnapshot()
    })
})
