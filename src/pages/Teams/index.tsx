import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Teams"

const Teams = loadable(() => import("./Teams"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Teams {...props} />
    </ErrorBoundary>
)

export { loadData }
