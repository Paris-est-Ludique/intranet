import { RouteConfig } from "react-router-config"

import App from "../app"
import AsyncHome, { loadData as loadHomeData } from "../pages/Home"
import AsyncAnnouncements, { loadData as loadAnnouncementsData } from "../pages/Announcements"
import AsyncPreRegisterPage, { loadData as loadPreRegisterPage } from "../pages/PreRegister"
import AsyncTeams, { loadData as loadTeamsData } from "../pages/Teams"
import AsyncBoard, { loadData as loadBoardData } from "../pages/Board"
import AsyncDayWishes, { loadData as loadDayWishesData } from "../pages/DayWishes"
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
                path: "/sinscrire",
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
                path: "/dayWishes",
                component: AsyncDayWishes,
                loadData: loadDayWishesData,
            },
            {
                path: "/wish",
                component: AsyncWish,
                loadData: loadWishData,
            },
            {
                path: "/board",
                component: AsyncBoard,
                loadData: loadBoardData,
            },
            {
                path: "/annonces",
                component: AsyncAnnouncements,
                loadData: loadAnnouncementsData,
            },
            {
                component: NotFound,
            },
        ],
    },
] as RouteConfig[]
