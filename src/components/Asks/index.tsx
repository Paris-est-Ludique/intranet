import _ from "lodash"
import React, { memo } from "react"
import styles from "./styles.module.scss"
import { useAskTools } from "./utils"
import { AskWelcome } from "./AskWelcome"
// import { AskBrunch, fetchFor as fetchForBrunch } from "./AskBrunch"
// import { AskRetex, fetchFor as fetchForRetex } from "./AskRetex"
import { AskDiscord, fetchFor as fetchForDiscord } from "./AskDiscord"
import { AskDayWishes, fetchFor as fetchForDayWishes } from "./AskDayWishes"
import { AskHosting, fetchFor as fetchForHosting } from "./AskHosting"
import { AskMeals, fetchFor as fetchForMeals } from "./AskMeals"
// import { AskPersonalInfo, fetchFor as fetchForPersonalInfo } from "./AskPersonalInfo"
import { AskTeamWishes, fetchFor as fetchForTeamWishes } from "./AskTeamWishes"
import {
    AskParticipationDetails,
    fetchFor as fetchForParticipationDetails,
} from "./AskParticipationDetails"
// import { AskPushNotif } from "./AskPushNotif"

const Asks = (): JSX.Element | null => {
    const { volunteerAsks } = useAskTools()
    const asks: JSX.Element[] = []

    AskWelcome(asks, 1)
    // AskBrunch(asks, 2)
    // AskRetex(asks, 3)
    AskDiscord(asks, 5)

    AskDayWishes(asks, 10)
    AskTeamWishes(asks, 11)
    AskMeals(asks, 15)
    // AskPersonalInfo(asks, 16)
    AskHosting(asks, 20)
    AskParticipationDetails(asks, 22)

    // AskPushNotif(asks, 99)

    if (_.isEmpty(asks)) {
        asks.push(
            <div key="pushNotifs">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <div className={styles.formLine}>
                            <label>
                                Si tu veux changer la réponse à l'une des questions posées ici, va
                                dans <a href="/profil">Mon profil</a> :)
                                <br />
                                Tu as fait le tour des dernières infos ou questions importantes,
                                merci !
                                <br />
                                Nous te préviendrons quand il y en aura de nouvelles.
                                <br />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (volunteerAsks === undefined) {
        return null
    }

    return <div>{asks.map<React.ReactNode>((t) => t).reduce((prev, curr) => [prev, curr])}</div>
}

export default memo(Asks)

// Fetch server-side data here
export const fetchFor = [
    // ...fetchForBrunch,
    // ...fetchForRetex,
    ...fetchForDiscord,
    ...fetchForDayWishes,
    ...fetchForHosting,
    ...fetchForMeals,
    ...fetchForTeamWishes,
    ...fetchForParticipationDetails,
    // ...fetchForPersonalInfo,
]
