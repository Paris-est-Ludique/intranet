import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Board"

const BoardPage = loadable(() => import("./Board"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <BoardPage {...props} />
    </ErrorBoundary>
)

export { loadData }
