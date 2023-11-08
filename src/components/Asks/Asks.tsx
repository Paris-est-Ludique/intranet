import isEmpty from 'lodash/isEmpty'
import type React from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'
import { useAskTools } from './utils'
import { AskWelcome } from './AskWelcome'

// import { AskBrunch, fetchForBrunch } from "./AskBrunch"
// import { AskRetex, fetchForRetex } from "./AskRetex"
import { AskDiscord, fetchForAskDiscord } from './AskDiscord'
import { AskDayWishes, fetchForAskDayWishes } from './AskDayWishes'
import { AskHosting, fetchForAskHosting } from './AskHosting'
import { AskMeals, fetchForAskMeals } from './AskMeals'

// import { AskPersonalInfo, fetchForPersonalInfo } from "./AskPersonalInfo"
import { AskTeamWishes, fetchForAskTeamWishes } from './AskTeamWishes'
import {
  AskParticipationDetails,
  fetchForAskParticipationDetails,
} from './AskParticipationDetails'

import { OnSiteInfo, fetchForOnSiteInfo } from './OnSiteInfo'

// import { AskPushNotif } from "./AskPushNotif"

function Asks(): JSX.Element | null {
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

  const onSiteInfoElement = OnSiteInfo()
  if (isEmpty(asks)) {
    asks.push(onSiteInfoElement)
    asks.push(asksEnd())
  }

  if (volunteerAsks === undefined) {
    return null
  }

  return <div>{asks.map<React.ReactNode>(t => t).reduce((prev, curr) => [prev, curr])}</div>
}

function asksEnd(): JSX.Element {
  return (
    <div key="pushNotifs">
      <div className={styles.notificationsPage}>
        <div className={styles.notificationsContent}>
          <div className={styles.formLine}>
            <label>
              Si tu veux changer la réponse à l'une des questions posées ici, va dans
              {' '}
              <a href="/profil">Mon profil</a>
              {' '}
              :)
              <br />
              Tu as fait le tour des dernières infos ou questions importantes, merci !
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

export default memo(Asks)

export const fetchForAsks = [
  ...fetchForOnSiteInfo,
  // ...fetchForBrunch,
  // ...fetchForRetex,
  ...fetchForAskDiscord,
  ...fetchForAskDayWishes,
  ...fetchForAskHosting,
  ...fetchForAskMeals,
  ...fetchForAskTeamWishes,
  ...fetchForAskParticipationDetails,
  // ...fetchForPersonalInfo,
]
