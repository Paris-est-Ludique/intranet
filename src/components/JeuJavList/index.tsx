import { memo } from "react"
import { useSelector, shallowEqual } from "react-redux"
import { EntityId } from "@reduxjs/toolkit"
// import { Link } from "react-router-dom"

import { AppState } from "../../store"
import styles from "./styles.module.scss"

interface Props {
    ids: EntityId[]
}

const List = ({ ids }: Props) => {
    const { entities: jeuxJav } = useSelector((state: AppState) => state.jeuJavList, shallowEqual)
    return (
        <div className={styles.JeuJavList}>
            <h4>Jeux JAV</h4>
            <ul>
                {ids.map((id) => {
                    const jeu = jeuxJav[id]
                    if (!jeu) {
                        return <li key={id}>Le jeu #{id} n&apos;existe pas</li>
                    }
                    const { titre, bggId } = jeu
                    return (
                        <li key={id}>
                            {titre} - [{bggId}]
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default memo(List)
