import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Register"

const Register = loadable(() => import("./Register"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Register {...props} />
    </ErrorBoundary>
)

export { loadData }
