import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props } from "./LoginPage"

const LoginPage = loadable(() => import("./LoginPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <LoginPage {...props} />
    </ErrorBoundary>
)
