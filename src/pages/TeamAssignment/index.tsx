import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./TeamAssignmentPage"

const TeamAssignmentPage = loadable(() => import("./TeamAssignmentPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <TeamAssignmentPage {...props} />
    </ErrorBoundary>
)

export { loadData }
