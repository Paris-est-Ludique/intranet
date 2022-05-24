import { RouteConfig } from "react-router-config"

import App from "../app"
import AsyncDbEdit, { loadData as loadDbEdit } from "../pages/Admin/DbEdit"
import AsyncGameDetailsUpdate, {
    loadData as loadGameDetailsUpdate,
} from "../pages/Admin/GameDetailsUpdate"
import AsyncHome, { loadData as loadHomeData } from "../pages/Home"
import AsyncAnnouncements, { loadData as loadAnnouncementsData } from "../pages/Announcements"
import AsyncTeamAssignment, { loadData as loadTeamAssignmentData } from "../pages/TeamAssignment"
import AsyncRegisterPage, { loadData as loadRegisterPage } from "../pages/Register"
import AsyncKnowledge, { loadData as loadKnowledgeData } from "../pages/Knowledge"
import AsyncTeams, { loadData as loadTeamsData } from "../pages/Teams"
import AsyncBoard, { loadData as loadBoardData } from "../pages/Board"
import AsyncVolunteers, { loadData as loadVolunteersData } from "../pages/Volunteers"
import AsyncWish, { loadData as loadWishData } from "../pages/Wish"
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
                path: "/edit",
                component: AsyncDbEdit,
                loadData: loadDbEdit,
            },
            {
                path: "/updateGameDetails",
                component: AsyncGameDetailsUpdate,
                loadData: loadGameDetailsUpdate,
            },
            {
                path: "/connaissances",
                component: AsyncKnowledge,
                loadData: loadKnowledgeData,
            },
            {
                path: "/preRegister",
                component: AsyncRegisterPage,
                loadData: loadRegisterPage,
            },
            {
                path: "/sinscrire",
                component: AsyncRegisterPage,
                loadData: loadRegisterPage,
            },
            {
                path: "/login",
                component: Login,
            },
            {
                path: "/sidentifier",
                component: Login,
            },
            {
                path: "/forgot",
                component: Forgot,
            },
            {
                path: "/oubli",
                component: Forgot,
            },
            {
                path: "/equipes",
                component: AsyncTeams,
                loadData: loadTeamsData,
            },
            {
                path: "/teams",
                component: AsyncTeams,
                loadData: loadTeamsData,
            },
            {
                path: "/wish",
                component: AsyncWish,
                loadData: loadWishData,
            },
            {
                path: "/profil",
                component: AsyncBoard,
                loadData: loadBoardData,
            },
            {
                path: "/benevoles",
                component: AsyncVolunteers,
                loadData: loadVolunteersData,
            },
            {
                path: "/annonces",
                component: AsyncAnnouncements,
                loadData: loadAnnouncementsData,
            },
            {
                path: "/team-assign",
                component: AsyncTeamAssignment,
                loadData: loadTeamAssignmentData,
            },
            {
                component: NotFound,
            },
        ],
    },
] as RouteConfig[]
