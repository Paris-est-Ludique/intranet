import { Request, Response, NextFunction } from "express"
import webpush from "web-push"

const publicKey = process.env.FORCE_ORANGE_PUBLIC_VAPID_KEY
const privateKey = process.env.FORCE_ORANGE_PRIVATE_VAPID_KEY
const hasPushAccess = publicKey && privateKey
if (hasPushAccess) {
    webpush.setVapidDetails("mailto: contact@parisestludique.fr", publicKey, privateKey)
}

export default function notificationsSubscribe(
    request: Request,
    response: Response,
    _next: NextFunction
): void {
    const subscription = request.body

    const payload = JSON.stringify({
        title: "Hello!",
        body: "It works.",
    })

    if (hasPushAccess) {
        webpush
            .sendNotification(subscription, payload)
            .then((result) => console.log(result))
            .catch((e) => console.log(e.stack))
    } else {
        console.error(
            `Fake sending push notif to ${JSON.stringify(subscription)} of ${JSON.stringify(
                payload
            )})}`
        )
    }

    response.status(200).json({ success: true })
}
