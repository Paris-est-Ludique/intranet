import { lowerFirst } from "lodash"
import { Request, Response, NextFunction } from "express"
import webpush from "web-push"
import {
    Announcement,
    AnnouncementWithoutId,
    translationAnnouncement,
} from "../services/announcement"
import { translationVolunteer, Volunteer, VolunteerWithoutId } from "../services/volunteers"
import { getSheet } from "./gsheets/accessors"

const publicKey = process.env.FORCE_ORANGE_PUBLIC_VAPID_KEY
const privateKey = process.env.FORCE_ORANGE_PRIVATE_VAPID_KEY
const hasPushAccess = publicKey && privateKey && !__DEV__ && !__LOCAL__
if (hasPushAccess) {
    webpush.setVapidDetails("mailto: contact@parisestludique.fr", publicKey, privateKey)
}
type Payload = {
    message: string
}

export function sendNotifToVolunteer(volunteer: Volunteer, payload: Payload): void {
    if (volunteer.acceptsNotifs !== "oui") {
        console.error(`Volunteer refuses notifs`)
    } else {
        const subscription = JSON.parse(volunteer.pushNotifSubscription)

        if (!subscription) {
            console.error(`Volunteer has no notif subscription`)
        } else if (hasPushAccess) {
            const stringifiedPayload = JSON.stringify(payload)
            webpush
                .sendNotification(subscription, stringifiedPayload)
                .then((result) => console.error(result))
                .catch((e) => console.error(e.stack))
        } else {
            console.error(
                `Fake sending push notif to ${JSON.stringify(subscription)} of ${JSON.stringify(
                    payload
                )})}`
            )
        }
    }
}

export function sendNotifToSubscription(
    subscription: webpush.PushSubscription,
    payload: Payload
): void {
    if (hasPushAccess) {
        const stringifiedPayload = JSON.stringify(payload)
        webpush
            .sendNotification(subscription, stringifiedPayload)
            .then((result) => console.error(result))
            .catch((e) => console.error(e.stack))
    } else {
        console.error(
            `Fake sending push notif to ${JSON.stringify(subscription)} of ${JSON.stringify(
                payload
            )})}`
        )
    }
}

export function notificationsSubscribe(
    request: Request,
    response: Response,
    _next: NextFunction
): void {
    sendNotifToSubscription(request.body, {
        message:
            "Clique-moi pour voir la gazette de février dans la page Annonces !\nFini les emails, cette notification sera notre seul moyen de te prévenir :)",
    })

    response.status(200).json({ success: true })
}

export function notificationMain(): void {
    setInterval(notifyAboutAnnouncement, 5 * 60 * 1000)
    setTimeout(notifyAboutAnnouncement, 60 * 1000)
}

async function notifyAboutAnnouncement(): Promise<void> {
    const announcementSheet = await getSheet<AnnouncementWithoutId, Announcement>(
        "Announcements",
        new Announcement(),
        translationAnnouncement
    )

    const announcementList = await announcementSheet.getList()
    if (!announcementList) {
        return
    }

    const toSend = announcementList.find((a) => !a.informedWithNotif)
    if (!toSend) {
        return
    }

    const volunteerSheet = await getSheet<VolunteerWithoutId, Volunteer>(
        "Volunteers",
        new Volunteer(),
        translationVolunteer
    )
    const volunteerList = await volunteerSheet.getList()
    if (!volunteerList) {
        return
    }

    const audience = volunteerList.filter(
        (v) => v.acceptsNotifs === "oui" && (v.active === "oui" || v.active === "peut-etre")
    )

    console.error(
        `Sending announcement ${toSend.title} to ${audience
            .map((v) => `${v.firstname} #${v.id}`)
            .join(", ")}`
    )

    const announceDescription: string =
        {
            gazette: / - /.test(toSend.title)
                ? `la ${lowerFirst(toSend.title.replace(/.* - /, ""))}`
                : `la gazette ${lowerFirst(toSend.title)}`,
            "compte rendu": `le compte-rendu du ${lowerFirst(toSend.title)}`,
        }[toSend.type] || toSend.title

    audience.forEach((v) => {
        sendNotifToVolunteer(v, {
            message: `Clique-moi pour voir ${announceDescription}`,
        })
    })

    toSend.informedWithNotif = true
    await announcementSheet.set(toSend)
}
