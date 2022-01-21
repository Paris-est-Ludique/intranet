import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./TeamsPage"

const Teams = loadable(() => import("./TeamsPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Teams {...props} />
    </ErrorBoundary>
)

export { loadData }
