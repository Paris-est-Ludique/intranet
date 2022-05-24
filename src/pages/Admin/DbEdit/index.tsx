import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../../components"
import { Props, loadData } from "./DbEdit"

const DbEditPage = loadable(() => import("./DbEdit"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <DbEditPage {...props} />
    </ErrorBoundary>
)

export { loadData }
