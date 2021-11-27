import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props } from "./RegisterPage"

const RegisterPage = loadable(() => import("./RegisterPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <RegisterPage {...props} />
    </ErrorBoundary>
)
