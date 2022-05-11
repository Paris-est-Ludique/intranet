import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./KnowledgesPage"

const Knowledges = loadable(() => import("./KnowledgesPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Knowledges {...props} />
    </ErrorBoundary>
)

export { loadData }
