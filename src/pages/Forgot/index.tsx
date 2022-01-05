import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props } from "./ForgotPage"

const ForgotPage = loadable(() => import("./ForgotPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <ForgotPage {...props} />
    </ErrorBoundary>
)
