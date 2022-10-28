import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./LoaningPage"

const Loaning = loadable(() => import("./LoaningPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Loaning {...props} />
    </ErrorBoundary>
)

export { loadData }
