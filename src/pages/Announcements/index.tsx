import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./Announcements"

const Announcements = loadable(() => import("./Announcements"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <Announcements {...props} />
    </ErrorBoundary>
)

export { loadData }
