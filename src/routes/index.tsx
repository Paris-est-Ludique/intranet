import AsyncEdit, { loadData as loadDbEdit } from '@/pages/Admin/Edit'
import AsyncGameDetailsUpdate, { loadData as loadGameDetailsUpdate } from '@/pages/Admin/GameDetailsUpdate'
import AsyncHome, { loadData as loadHomeData } from '@/pages/Home'
import AsyncAnnouncements, { loadData as loadAnnouncementsData } from '@/pages/Announcements'
import AsyncTeamAssignment, { loadData as loadTeamAssignmentData } from '@/pages/TeamAssignment'
import AsyncRegisterPage, { loadData as loadRegisterPage } from '@/pages/Register'
import AsyncKnowledge, { loadData as loadKnowledgeData } from '@/pages/Knowledge'
import AsyncKnowledgeStats, { loadData as loadKnowledgeStatsData } from '@/pages/KnowledgeStats'

// import AsyncLoans, { loadData as loadLoansData } from "@/pages/Loans"

import AsyncLoaning, { loadData as loadLoaningData } from '@/pages/Loaning'
import AsyncKnowledgeCards, { loadData as loadCardKnowledgeData } from '@/pages/KnowledgeCards'
import AsyncTeams, { loadData as loadTeamsData } from '@/pages/Teams'
import AsyncBoard, { loadData as loadBoardData } from '@/pages/Board'
import AsyncVolunteers, { loadData as loadVolunteersData } from '@/pages/Volunteers'
import AsyncWish, { loadData as loadWishData } from '@/pages/Wish'
import Login from '@/pages/Login'
import Forgot from '@/pages/Forgot'
import NotFound from '@/pages/NotFound'

export const routes = [
  {
    path: '/',
    exact: true,
    element: <AsyncHome />,
    loadData: loadHomeData,
  },
  {
    path: '/edit',
    element: <AsyncEdit />,
    loadData: loadDbEdit,
  },
  {
    path: '/updateGameDetails',
    element: <AsyncGameDetailsUpdate />,
    loadData: loadGameDetailsUpdate,
  },
  {
    path: '/connaissances',
    element: <AsyncKnowledge />,
    loadData: loadKnowledgeData,
  },
  {
    path: '/stats',
    element: <AsyncKnowledgeStats />,
    loadData: loadKnowledgeStatsData,
  },

  // {
  //     path: "/emprunts",
  //     element: AsyncLoans,
  //     loadData: loadLoansData,
  // },

  {
    path: '/emprunter',
    element: <AsyncLoaning />,
    loadData: loadLoaningData,
  },
  {
    path: '/fiches',
    element: <AsyncKnowledgeCards />,
    loadData: loadCardKnowledgeData,
    meh: 'doh',
  },
  {
    path: '/preRegister',
    element: <AsyncRegisterPage />,
    loadData: loadRegisterPage,
  },
  {
    path: '/sinscrire',
    element: <AsyncRegisterPage />,
    loadData: loadRegisterPage,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sidentifier',
    element: <Login />,
  },
  {
    path: '/forgot',
    element: <Forgot />,
  },
  {
    path: '/oubli',
    element: <Forgot />,
  },
  {
    path: '/equipes',
    element: <AsyncTeams />,
    loadData: loadTeamsData,
  },
  {
    path: '/teams',
    element: <AsyncTeams />,
    loadData: loadTeamsData,
  },
  {
    path: '/wish',
    element: <AsyncWish />,
    loadData: loadWishData,
  },
  {
    path: '/profil',
    element: <AsyncBoard />,
    loadData: loadBoardData,
  },
  {
    path: '/benevoles',
    element: <AsyncVolunteers />,
    loadData: loadVolunteersData,
  },
  {
    path: '/annonces',
    element: <AsyncAnnouncements />,
    loadData: loadAnnouncementsData,
  },
  {
    path: '/team-assign',
    element: <AsyncTeamAssignment />,
    loadData: loadTeamAssignmentData,
  },
  {
    element: NotFound,
  },
]
