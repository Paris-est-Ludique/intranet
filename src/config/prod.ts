import isNode from "detect-node"

const PROTOCOL = (typeof window !== "undefined" && window?.location?.protocol) || "http:"
const PORT = 4000 + (PROTOCOL === "https:" ? 2 : 0)
const API_URL =
    __DEV__ || __LOCAL__ || isNode
        ? `${PROTOCOL}//localhost:${PORT}`
        : `${PROTOCOL}//fo.parisestludique.fr`

export default {
    PORT,
    HOST: "0.0.0.0",
    API_URL,
}
