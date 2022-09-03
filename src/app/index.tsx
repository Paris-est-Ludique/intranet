import { RouteConfig, renderRoutes } from "react-router-config"
import { Helmet } from "react-helmet"
import { ToastContainer } from "react-toastify"

import config from "../config"
// Import your global styles here
import "normalize.css/normalize.css"
import "react-toastify/dist/ReactToastify.css"
import styles from "./styles.module.scss"
import MainMenu from "../components/Navigation/MainMenu"
import LogoutButton from "../components/LogoutButton/LogoutButton"

interface Route {
    route: { routes: RouteConfig[] }
    location: Location
}

export const reactAppId = "react-view"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = ({ route, location }: Route): JSX.Element => {
    if (location.pathname === "/fiches") {
        return <div className={styles.cardPage}>{renderRoutes(route.routes)}</div>
    }
    // else

    return (
        <div>
            <Helmet {...config.APP}>
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
                    <div className={styles.siteDescription}>{config.APP.description}</div>
                </div>
                <div className={styles.menuWrapper}>
                    <MainMenu />
                </div>
                <div className={styles.logoutWrapper}>
                    <LogoutButton />
                </div>
            </header>
            {/* Child routes won't render without this */}
            {renderRoutes(route.routes)}
            <ToastContainer />
            <script>var browser = browser || chrome</script>
        </div>
    )
}

export default App
