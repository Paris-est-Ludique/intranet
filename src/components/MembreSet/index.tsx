import React, { useState, memo } from "react"
import { toast } from "react-toastify"

import { AppDispatch } from "../../store"

import { fetchMembreSet } from "../../store/membreSet"
import { Membre } from "../../services/membres"
import styles from "./styles.module.scss"

interface Props {
    dispatch: AppDispatch
    membre: Membre
}

const MembreSet = ({ dispatch, membre }: Props) => {
    const [firstname, setFirstname] = useState(membre.firstname)
    const [lastname, setName] = useState(membre.lastname)
    const [adult, setAdult] = useState(membre.adult)

    const onFirstnameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFirstname(e.target.value)
    const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    const onAdultChanged = (e: React.ChangeEvent<HTMLInputElement>) => setAdult(+e.target.value)

    const onSavePostClicked = () => {
        if (firstname && lastname) {
            dispatch(
                fetchMembreSet({
                    ...membre,
                    firstname,
                    lastname,
                    adult,
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
                <label htmlFor="postFirstname">
                    Prénom:
                    <input
                        type="text"
                        id="postFirstname"
                        name="postFirstname"
                        value={firstname}
                        onChange={onFirstnameChanged}
                    />
                </label>
                <label htmlFor="postName">
                    Nom:
                    <input
                        type="text"
                        id="postName"
                        name="postName"
                        value={lastname}
                        onChange={onNameChanged}
                    />
                </label>
                <label htmlFor="postAdult">
                    Majeur:
                    <input
                        type="text"
                        id="postAdult"
                        name="postAdult"
                        value={adult}
                        onChange={onAdultChanged}
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
