import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./KnowledgeStatsPage"

const Knowledges = loadable(() => import("./KnowledgeStatsPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Knowledges {...props} />
    </ErrorBoundary>
)

export { loadData }
