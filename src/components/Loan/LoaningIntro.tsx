import classnames from 'classnames'
import type React from 'react'
import styles from './styles.module.scss'

const LoaningIntro: React.FC = (): JSX.Element => (
  <div className={styles.loanThings}>
    <h1>Emprunt et tri des jeux</h1>
    <p>
      Lors du brunch des bénévoles ayant contribué au dernier festival, des boîtes de jeux en
      trop dans la ludothèque seront données, et des boîtes qui passent l'année dans la cave
      entre deux éditions seront prêtées pour 4 mois.
    </p>
    <p>
      Pour chaque jeu, active le bouton :
      <br />
      <button
        type="button"
        className={classnames(styles.loanButton, styles.loanable, styles.loanableCheckbox)}
      >
                &nbsp;
      </button>
      {' '}
      si tu veux l'emprunter lors du brunch ou d'un rdv bénévoles mensuel
      <br />
      <button
        type="button"
        className={classnames(styles.loanButton, styles.playable, styles.playableCheckbox)}
      >
                &nbsp;
      </button>
      {' '}
      si tu penses que les visiteurs du festival (ou même les bénévoles) doivent pouvoir y
      jouer
      <br />
      <button
        type="button"
        className={classnames(styles.loanButton, styles.giftable, styles.giftableCheckbox)}
      >
                &nbsp;
      </button>
      {' '}
      si tu aimerais le récupérer comme cadeau lors du brunch (ou rdv bénévole si tu ne peux
      pas venir)
      <br />
      <button
        type="button"
        className={classnames(
          styles.loanButton,
          styles.noOpinion,
          styles.noOpinionCheckbox,
        )}
      >
                &nbsp;
      </button>
      {' '}
      si tu n'as pas d'avis sur ce jeu
      <br />
    </p>
  </div>
)

export default LoaningIntro
