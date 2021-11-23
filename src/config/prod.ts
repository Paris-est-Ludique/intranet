const PORT = 4000
const HOST =
    __SERVER__ && !__DEV__ ? process.env.INTRANET_HOST || "fo.parisestludique.fr" : "localhost"

export default {
    PORT,
    HOST: "0.0.0.0",
    API_URL: `http://${HOST}:${PORT}`,
}
