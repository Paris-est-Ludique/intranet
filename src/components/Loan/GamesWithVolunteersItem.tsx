import React, { memo } from "react"
import classnames from "classnames"
import styles from "./styles.module.scss"
import { GameWithVolunteers } from "../../services/games"
import { gameTitleExactCategory } from "../../store/utils"

interface Props {
    gameWithLoans: GameWithVolunteers
}

const LoanGamesItem: React.FC<Props> = ({ gameWithLoans }): JSX.Element => {
    const { bggPhoto, title, bggId, poufpaf, bggIdAlternative, volunteerNicknames, boxCount } =
        gameWithLoans
    const isBggPhoto = !/^[0-9]+\.[a-zA-Z]+$/.test(bggPhoto)

    return (
        <li className={styles.boxItem}>
            <div className={styles.photoContainer}>
                {isBggPhoto && <img className={styles.photo} src={bggPhoto} alt="" />}
                {!isBggPhoto && (
                    <div
                        className={classnames(
                            styles.alternateBox,
                            styles[`a${bggPhoto.replace(/\..*/, "")}`]
                        )}
                    >
                        {" "}
                    </div>
                )}
            </div>
            <div className={classnames(styles.titleContainer, poufpaf && styles.shorterTitle)}>
                <a
                    href={
                        bggId > 0
                            ? `https://boardgamegeek.com/boardgame/${bggId}`
                            : bggIdAlternative
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={styles.title}
                >
                    {title}
                </a>
            </div>
            <a
                href={`https://sites.google.com/site/poufpafpasteque/fiches_alpha/${poufpaf}`}
                target="_blank"
                rel="noreferrer"
            >
                <div className={poufpaf ? styles.poufpaf : styles.noPoufpaf}> </div>
            </a>
            <div className={styles.boxCount}>
                {boxCount > 1 ? `${boxCount} boîtes` : ""}
                <br />
                {gameTitleExactCategory({ title })}
            </div>
            <div className={styles.volunteerList}>
                Bénévoles intéressés: {volunteerNicknames.join(", ")}
            </div>
        </li>
    )
}

export default memo(LoanGamesItem)
