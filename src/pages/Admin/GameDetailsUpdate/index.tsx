import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../../components"
import { Props, loadData } from "./GameDetailsUpdate"

const GameDetailsUpdatePage = loadable(() => import("./GameDetailsUpdate"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <GameDetailsUpdatePage {...props} />
    </ErrorBoundary>
)

export { loadData }
