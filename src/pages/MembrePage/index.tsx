import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./MembrePage"

const MembrePage = loadable(() => import("./MembrePage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <MembrePage {...props} />
    </ErrorBoundary>
)
export { loadData }
