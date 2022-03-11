import { memo } from "react"
import { useSelector, shallowEqual } from "react-redux"
import { EntityId } from "@reduxjs/toolkit"
// import { Link } from "react-router-dom"

import { AppState } from "../../store"
import styles from "./styles.module.scss"

interface Props {
    ids: EntityId[]
}

const GameList = ({ ids }: Props) => {
    const { entities: jeux } = useSelector((state: AppState) => state.gameList, shallowEqual)
    return (
        <div className={styles.GameList}>
            <h4>Jeux JAV</h4>
            <ul>
                {ids.map((id) => {
                    const jeu = jeux[id]
                    if (!jeu) {
                        return <li key={id}>Le jeu #{id} n&apos;existe pas</li>
                    }
                    const { title, bggId } = jeu
                    return (
                        <li key={id}>
                            {title} - [{bggId}]
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default memo(GameList)
