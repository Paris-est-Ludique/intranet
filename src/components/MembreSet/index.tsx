import React, { useState, memo } from "react"
import { toast } from "react-toastify"

import { AppDispatch } from "../../store"

import { sendMembreSet } from "../../store/membreSet"
import { Membre } from "../../services/membres"
import styles from "./styles.module.scss"

interface Props {
    dispatch: AppDispatch
    membre: Membre
}

const MembreSet = ({ dispatch, membre }: Props) => {
    const [prenom, setPrenom] = useState(membre.prenom)
    const [nom, setNom] = useState(membre.nom)
    const [majeur, setMajeur] = useState(membre.majeur)

    const onPrenomChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPrenom(e.target.value)
    const onNomChanged = (e: React.ChangeEvent<HTMLInputElement>) => setNom(e.target.value)
    const onMajeurChanged = (e: React.ChangeEvent<HTMLInputElement>) => setMajeur(+e.target.value)

    const onSavePostClicked = () => {
        if (prenom && nom) {
            dispatch(
                sendMembreSet({
                    ...membre,
                    prenom,
                    nom,
                    majeur,
                })
            )
        } else {
            toast.warning("Il faut au moins préciser un prenom et un nom", {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }
    return (
        <section className={styles.MembreList}>
            <h2>Modifier un membre</h2>
            <form>
                <label htmlFor="postPrenom">
                    Prenom:
                    <input
                        type="text"
                        id="postPrenom"
                        name="postPrenom"
                        value={prenom}
                        onChange={onPrenomChanged}
                    />
                </label>
                <label htmlFor="postNom">
                    Nom:
                    <input
                        type="text"
                        id="postNom"
                        name="postNom"
                        value={nom}
                        onChange={onNomChanged}
                    />
                </label>
                <label htmlFor="postMajeur">
                    Majeur:
                    <input
                        type="text"
                        id="postMajeur"
                        name="postMajeur"
                        value={majeur}
                        onChange={onMajeurChanged}
                    />
                </label>
                <button type="button" onClick={onSavePostClicked}>
                    Save changes
                </button>
            </form>
        </section>
    )
}
export default memo(MembreSet)
