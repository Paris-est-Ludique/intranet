import React from "react"
import styles from "./styles.module.scss"

const LoansIntro: React.FC = (): JSX.Element => (
    <div className={styles.loanThings}>
        <h1>Jeux à emprunter</h1>
        <p>
            Si un jeu qui t'intéresse est emprunté par un autre bénévole, son nom sera affiché ici.
            Vous pourrez peut-être envisager d'y jouer ensemble !
        </p>
    </div>
)

export default LoansIntro
