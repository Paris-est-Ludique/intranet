import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./LoanPage"

const Loan = loadable(() => import("./LoanPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Loan {...props} />
    </ErrorBoundary>
)

export { loadData }
