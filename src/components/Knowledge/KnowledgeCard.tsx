import type React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

// import styles from "./styles.module.scss"
import { fetchBoxListIfNeed, selectContainerSortedDetailedBoxes } from '@/store/boxList'
import {
  fetchVolunteerDetailedKnowledgeListIfNeed,
  selectVolunteerDetailedKnowledgeList,
} from '@/store/volunteerDetailedKnowledgeList'
import type { DetailedBox } from '@/services/boxes'
import type { VolunteerDetailedKnowledge } from '@/services/volunteers'

const KnowledgeCard: React.FC = (): JSX.Element | null => {
  const detailedBoxes = useSelector(selectContainerSortedDetailedBoxes) as DetailedBox[]
  const volunteerDetailedKnowledgeList = useSelector(selectVolunteerDetailedKnowledgeList)

  return <>{detailedBoxes.map(box => boxElement(box, volunteerDetailedKnowledgeList))}</>
}

function boxElement(box: DetailedBox, volunteerDetailedKnowledgeList: VolunteerDetailedKnowledge[]): JSX.Element {
  const playerCount: string
        = box.playersMin === box.playersMax
          ? `${box.playersMin}`
          : `${box.playersMin} à ${box.playersMax}`

  const typeStyle = {
    '': null,
    'Jeux à deux': null,
    'Rapide': null,
    'Enfants': null,
    'Ambiance': styles.verteImg,
    'Famille': styles.orangeImg,
    'Expert': styles.rougeImg,
  }[box.type]

  const year = new Date().getFullYear()

  const okVolunteers = wiseVolunteers(volunteerDetailedKnowledgeList, box.gameId, 'ok')
  const bofVolunteers = wiseVolunteers(volunteerDetailedKnowledgeList, box.gameId, 'bof')
  const someOk = okVolunteers.length > 0
  const someBof = bofVolunteers.length > 0
  const some = someOk || someBof

  return (
    <div key={box.id} className={styles.card}>
      <header className={styles.header}>{box.title}</header>
      <div className={styles.showUnknownOnlyLabeldetail}>
        <div className={styles.masteryContainer}>
          <table>
            <tbody>
              <tr>
                <td className={styles.imageContainer}>
                  <img
                    className={styles.gameImage}
                    src={box.bggPhoto}
                    alt="Board game box"
                  />
                </td>
                <td className={styles.tableBenevoles}>
                  <table className={styles.benevolesContainer}>
                    <tbody>
                      <tr className={styles.okHeader}>
                        <td>Ils maîtrisent</td>
                      </tr>
                      <tr className={styles.listOk}>
                        <td>
                          <div className={styles.nicknameContainer}>
                            {okVolunteers}
                            {!some && (
                              <>
                                Désolé aucun bénévole n'y a joué, il
                                va falloir lire la règle.
                              </>
                            )}
                            {!someOk && someBof && (
                              <>
                                Aucun bénévole ne maîtrise les
                                règles de ce jeu.
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {someBof && (
                        <tr className={styles.bofHeader}>
                          <td>Ils connaissent</td>
                        </tr>
                      )}
                      {someBof && (
                        <tr className={styles.listBof}>
                          <td>
                            <div className={styles.nicknameContainer}>
                              {bofVolunteers}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.gamedetailContainer}>
          <table>
            <tbody>
              <tr>
                <td className={styles.numberOfPlayersImgContainer}>
                  <div className={styles.numberOfPlayersImg} />
                </td>
                <td className={styles.numberOfPlayers}>{playerCount}</td>

                <td className={styles.durationImgContainer}>
                  <div className={styles.durationImg} />
                </td>
                <td className={styles.duration}>
                  {box.duration}
                  {' '}
                  min
                </td>

                <td className={styles.typeImgContainer}>
                  <div className={typeStyle} />
                </td>
                <td className={styles.type}>{box.type}</td>

                <td className={styles.pppImgContainer}>
                  <div className={styles.pppImg} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.year}>{year}</div>
        <div className={styles.container}>{box.container}</div>
      </footer>
    </div>
  )
}

function wiseVolunteers(
  volunteersKnowledge: VolunteerDetailedKnowledge[],
  gameId: number,
  wiseness: 'ok' | 'bof',
): JSX.Element[] {
  return volunteersKnowledge
    .filter(
      v =>
        v[wiseness].includes(gameId)
                && (v.dayWishes.includes('S') || v.dayWishes.includes('D')),
    )
    .map(v => (
      <div key={v.id} className={styles.nickname}>
        <b>{v.nickname.charAt(0).toUpperCase()}</b>
        {v.nickname.substring(1)}
        {v.dayWishes.includes('S') && !v.dayWishes.includes('D') && (
          <span className={styles.oneDayOnly}>(sam.)</span>
        )}
        {!v.dayWishes.includes('S') && v.dayWishes.includes('D') && (
          <span className={styles.oneDayOnly}>(dim.)</span>
        )}
      </div>
    ))
}

export default memo(KnowledgeCard)

export const fetchForKnowledgeCard = [fetchBoxListIfNeed, fetchVolunteerDetailedKnowledgeListIfNeed]
