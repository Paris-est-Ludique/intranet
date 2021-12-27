import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Wish"

const Wish = loadable(() => import("./Wish"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Wish {...props} />
    </ErrorBoundary>
)
export { loadData }
