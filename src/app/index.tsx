import { Link } from "react-router-dom"
import { RouteConfig, renderRoutes } from "react-router-config"
import { Helmet } from "react-helmet"
import { ToastContainer } from "react-toastify"

import config from "../config"
// Import your global styles here
import "normalize.css/normalize.css"
import "react-toastify/dist/ReactToastify.css"
import styles from "./styles.module.scss"
import MainMenu from "../components/Navigation/MainMenu"

interface Route {
    route: { routes: RouteConfig[] }
}

const App = ({ route }: Route): JSX.Element => (
    <div>
        <Helmet {...config.APP}>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
        </Helmet>
        <header className={styles.header}>
            <div className={styles.logo} />
            <div className={styles.siteNameWrapper}>
                <h1 className={styles.siteName}>
                    <Link to="/">{config.APP.title}</Link>
                </h1>
                <div className={styles.siteDescription}>{config.APP.description}</div>
            </div>
            <div className={styles.menuWrapper}>
                <MainMenu />
            </div>
        </header>
        {/* Child routes won't render without this */}
        {renderRoutes(route.routes)}
        <ToastContainer />
    </div>
)

export default App
