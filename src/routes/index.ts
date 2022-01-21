import { RouteConfig } from "react-router-config"

import App from "../app"
import AsyncHome, { loadData as loadHomeData } from "../pages/Home"
import AsyncPreRegisterPage, { loadData as loadPreRegisterPage } from "../pages/PreRegister"
import AsyncTeams, { loadData as loadTeamsData } from "../pages/Teams"
import AsyncTeamWishes, { loadData as loadTeamWishesData } from "../pages/TeamWishes"
import AsyncWish, { loadData as loadWishData } from "../pages/Wish"
import AsyncVolunteerPage, { loadData as loadVolunteerPageData } from "../pages/VolunteerPage"
import Login from "../pages/Login"
import Forgot from "../pages/Forgot"
import NotFound from "../pages/NotFound"

export default [
    {
        component: App,
        routes: [
            {
                path: "/",
                exact: true,
                component: AsyncHome,
                loadData: loadHomeData,
            },
            {
                path: "/preRegister",
                component: AsyncPreRegisterPage,
                loadData: loadPreRegisterPage,
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
                path: "/forgot",
                component: Forgot,
            },
            {
                path: "/teams",
                component: AsyncTeams,
                loadData: loadTeamsData,
            },
            {
                path: "/teamWishes",
                component: AsyncTeamWishes,
                loadData: loadTeamWishesData,
            },
            {
                path: "/wish",
                component: AsyncWish,
                loadData: loadWishData,
            },
            {
                component: NotFound,
            },
        ],
    },
] as RouteConfig[]
