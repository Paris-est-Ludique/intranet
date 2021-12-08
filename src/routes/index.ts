import { RouteConfig } from "react-router-config"

import App from "../app"
import AsyncHome, { loadData as loadHomeData } from "../pages/Home"
import AsyncVolunteerPage, { loadData as loadVolunteerPageData } from "../pages/VolunteerPage"
import Login from "../pages/Login"
import Register from "../pages/Register"
import NotFound from "../pages/NotFound"

export default [
    {
        component: App,
        routes: [
            {
                path: "/",
                exact: true,
                component: Register,
            },
            {
                path: "/VolunteerPage/:id",
                component: AsyncVolunteerPage,
                loadData: loadVolunteerPageData,
            },
            {
                path: "/login",
                component: Login,
            },
            {
                path: "/register",
                component: AsyncHome,
                loadData: loadHomeData,
            },
            {
                component: NotFound,
            },
        ],
    },
] as RouteConfig[]
