import os from "os"

const hostname = os.hostname()

export default {
    PORT: 4000,
    HOST: hostname === "ns3075300" ? "fo.parisestludique.fr" : "localhost",
    API_URL: hostname === "ns3075300" ? "http://fo.parisestludique.fr" : "http://localhost:4000",
}
