import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./PreRegister"

const PreRegister = loadable(() => import("./PreRegister"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <PreRegister {...props} />
    </ErrorBoundary>
)

export { loadData }
