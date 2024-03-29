import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Home"

const HomePage = loadable(() => import("./Home"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <HomePage {...props} />
    </ErrorBoundary>
)

export { loadData }
