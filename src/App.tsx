import type { Route } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'
import styles from './App.module.scss'

import MainMenu from '@/components/Navigation/MainMenu'
import LogoutButton from '@/components/LogoutButton/LogoutButton'

import { routes } from '@/routes'

// Global styles
import 'normalize.css/normalize.css'
import 'react-toastify/dist/ReactToastify.css'

const helmetSettings = {
  htmlAttributes: { lang: 'en' },
  title: 'Force Orange',
  description: 'Le site des bénévoles',
  titleTemplate: 'Force Orange - %s',
  meta: [
    {
      name: 'description',
      content: 'The best react universal starter boilerplate in the world.',
    },
  ],
}

export function App({ route, location }: { route: Route; location: Location }): JSX.Element {
  if (location?.pathname === '/fiches') {
    // TODO use a better way to handle this
    return <div className={styles.cardPage}>{useRoutes(route)}</div>
  }

  return (
    <div>
      <Helmet {...helmetSettings}>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Helmet>
      <header className={styles.header}>
        <div className={styles.logo} />
        <div>
          <h1 className={styles.siteName}>
            <a href="/">{helmetSettings.title}</a>
          </h1>
          <div className={styles.siteDescription}>{helmetSettings.description}</div>
        </div>
        <div className={styles.menuWrapper}>
          <MainMenu />
        </div>
        <div className={styles.logoutWrapper}>
          <LogoutButton />
        </div>
      </header>
      {useRoutes(routes)}
      <ToastContainer />
    </div>
  )
}
