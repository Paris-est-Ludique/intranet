import type React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import GamesWithVolunteersItem from './GamesWithVolunteersItem'
import {
  fetchGameWithVolunteersListIfNeed,
  selectSortedUniqueGamesWithVolunteers,
} from '@/store/gameWithVolunteersList'
import type { GameWithVolunteers } from '@/services/games'

const Loans: React.FC = (): JSX.Element | null => {
  const gameWithLoans: GameWithVolunteers[] = useSelector(selectSortedUniqueGamesWithVolunteers)

  const loanGames = gameWithLoans.filter(game => game.toLoan)

  // const giftGames = gameWithLoans.filter(game => !game.toLoan)

  return (
    <div>
      <h3>Jeux que tu veux emprunter</h3>
      {loanGames.length > 0 && (
        <ul className={styles.boxList}>
          {loanGames.map(game => (
            <GamesWithVolunteersItem
              gameWithLoans={game}
              key={game.id}
            />
          ))}
        </ul>
      )}
      {loanGames.length === 0 && <>Aucun jeu.</>}

      {/* {giftGames.length > 0 && <>
            <h3>Jeux que tu voudrais récupérer définitivement</h3>
            <ul className={styles.boxList}>
                {giftGames.map(game => (
                    <GamesWithVolunteersItem
                        gameWithLoans={game}
                        key={game.id}
                    />
                ))}
            </ul>
        </>} */}
    </div>
  )
}

export default memo(Loans)

export const fetchForLoans = [fetchGameWithVolunteersListIfNeed]
