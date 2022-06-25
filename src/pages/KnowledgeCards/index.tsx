import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./KnowledgeCardsPage"

const Knowledges = loadable(() => import("./KnowledgeCardsPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Knowledges {...props} />
    </ErrorBoundary>
)

export { loadData }
