import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Volunteers"

const BoardPage = loadable(() => import("./Volunteers"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <BoardPage {...props} />
    </ErrorBoundary>
)

export { loadData }
