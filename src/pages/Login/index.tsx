import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props } from "./Login"

const Login = loadable(() => import("./Login"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Login {...props} />
    </ErrorBoundary>
)
