import { RouteConfig } from "react-router-config"

import App from "../app"
import AsyncHome, { loadData as loadHomeData } from "../pages/Home"
import AsyncMembrePage, { loadData as loadMembrePageData } from "../pages/MembrePage"
import Login from "../pages/Login"
import Register from "../pages/Register"
import NotFound from "../pages/NotFound"

export default [
    {
        component: App,
        routes: [
            {
                path: "/",
                component: Register,
            },
            {
                path: "/MembrePage/:id",
                component: AsyncMembrePage,
                loadData: loadMembrePageData,
            },
            {
                path: "/login",
                component: Login,
            },
            {
                path: "/register",
                exact: true,
                component: AsyncHome,
                loadData: loadHomeData,
            },
            {
                component: NotFound,
            },
        ],
    },
] as RouteConfig[]
