const PORT = 4000
const HOST_LOCALLY = true

export default {
    PORT,
    HOST: HOST_LOCALLY ? "localhost" : "fo.parisestludique.fr",
    API_URL:
        __SERVER__ || HOST_LOCALLY
            ? `http://localhost:${PORT}`
            : `http://fo.parisestludique.fr:${PORT}`,
}
