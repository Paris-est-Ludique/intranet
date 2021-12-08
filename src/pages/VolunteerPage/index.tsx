import loadable from "@loadable/component"

import { Loading, ErrorBoundary } from "../../components"
import { Props, loadData } from "./VolunteerPage"

const VolunteerPage = loadable(() => import("./VolunteerPage"), {
    fallback: <Loading />,
})

export default (props: Props): JSX.Element => (
    <ErrorBoundary>
        <VolunteerPage {...props} />
    </ErrorBoundary>
)
export { loadData }
