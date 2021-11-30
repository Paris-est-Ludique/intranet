const PORT = 4000
const API_URL = __DEV__ || __LOCAL__ ? `http://localhost:${PORT}` : "https://fo.parisestludique.fr"

export default {
    PORT,
    HOST: "0.0.0.0",
    API_URL,
}
