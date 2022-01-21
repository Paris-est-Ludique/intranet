import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./DayWishes"

const HomePage = loadable(() => import("./DayWishes"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <HomePage {...props} />
    </ErrorBoundary>
)

export { loadData }
