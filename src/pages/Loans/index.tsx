import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./LoansPage"

const Loans = loadable(() => import("./LoansPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Loans {...props} />
    </ErrorBoundary>
)

export { loadData }
