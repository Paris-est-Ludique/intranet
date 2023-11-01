import styles from './App.styles.scss?inline'

import { useRoutes } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'

import MainMenu from '@/components/Navigation/MainMenu'
import LogoutButton from '@/components/LogoutButton/LogoutButton'

// Import your global styles here
import 'normalize.css/normalize.css'
import 'react-toastify/dist/ReactToastify.css'

export const reactAppId = 'react-view'

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

export function App({ route, location }): JSX.Element {
  if (location.pathname === '/fiches') {
    return <div className={styles.cardPage}>{renderRoutes(route.routes)}</div>
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
            <a href="/">{config.APP.title}</a>
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
      <script>var browser = browser || chrome</script>
    </div>
  )
}
