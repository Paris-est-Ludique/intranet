import { RouteConfig } from "react-router-config"

import App from "../app"
import AsyncHome, { loadData as loadHomeData } from "../pages/Home"
import AsyncMembrePage, { loadData as loadMembrePageData } from "../pages/MembrePage"
import NotFound from "../pages/NotFound"

export default [
    {
        component: App,
        routes: [
            {
                path: "/",
                exact: true,
                component: AsyncHome, // Add your page here
                loadData: loadHomeData, // Add your pre-fetch method here
            },
            {
                path: "/MembrePage/:id",
                component: AsyncMembrePage,
                loadData: loadMembrePageData,
            },
            {
                component: NotFound,
            },
        ],
    },
] as RouteConfig[]
