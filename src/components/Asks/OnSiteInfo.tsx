import { get, first, tail } from "lodash"
import { useSelector } from "react-redux"
import styles from "./styles.module.scss"
import {
    fetchVolunteerOnSiteInfoIfNeed,
    selectVolunteerOnSiteInfo,
} from "../../store/volunteerOnSiteInfo"
import { Contact, VolunteerOnSiteInfo } from "../../services/volunteers"

export function OnSiteInfo(): JSX.Element {
    const userOnSiteInfo: VolunteerOnSiteInfo | undefined = useSelector(selectVolunteerOnSiteInfo)
    const referents = get(userOnSiteInfo, "referents", [])
    const members = get(userOnSiteInfo, "members", [])
    // const isReferent = get(userOnSiteInfo, "isReferent", false)
    const CAPilots = get(userOnSiteInfo, "CAPilots", [])

    const pincipalReferent = first(referents)
    const secondaryReferents = tail(referents)

    return (
        <div key="contacts">
            <div className={styles.notificationsPage}>
                <div className={styles.notificationsContent}>
                    <div className={styles.formLine}>
                        <div className={styles.title}>Contacts sur la pelouse</div>
                        <label>
                            {pincipalReferent && (
                                <div>
                                    Référent.e{secondaryReferents.length > 0 && <> principal.e</>} :{" "}
                                    {contactElement(pincipalReferent)}
                                    <br />
                                    <br />
                                </div>
                            )}
                            {secondaryReferents.length > 0 && (
                                <div>
                                    Référent.e.s secondaire.s :{" "}
                                    <div className={styles.contactList}>
                                        {secondaryReferents.map((contact) => (
                                            <div key={contact.firstname}>
                                                {contactElement(contact)}
                                            </div>
                                        ))}
                                        <br />
                                    </div>
                                </div>
                            )}
                            <div>Ton contact à la Paillante : à définir...</div>
                            <br />
                            <div>Si un exposant à une question : à définir...</div>
                            <br />
                            {CAPilots.length > 0 && (
                                <div>
                                    Membre du CA si besoin :{" "}
                                    <div className={styles.contactList}>
                                        {CAPilots.map((contact) => (
                                            <div key={contact.firstname}>
                                                {contactElement(contact)}
                                            </div>
                                        ))}
                                    </div>
                                    <br />
                                    <br />
                                </div>
                            )}
                            Croix rouge présente sur le festival : tel prochainement
                            <br />
                            {members.length > 0 && (
                                <div>
                                    Autre membres de l'équipe :{" "}
                                    <div className={styles.contactList}>
                                        {members.map((contact) => (
                                            <div key={contact.firstname}>
                                                {contactElement(contact)}
                                            </div>
                                        ))}
                                        <br />
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

function contactElement(contact: Contact): JSX.Element {
    return (
        <div className={styles.contactList}>
            {contact.firstname} <a href={`tel: ${contact.mobile}`}>{contact.mobile}</a>
        </div>
    )
}

// Fetch server-side data here
export const fetchFor = [fetchVolunteerOnSiteInfoIfNeed]
