import React, { useState, memo } from "react"
import { toast } from "react-toastify"

import { AppDispatch } from "../../store"

import { postEnvie } from "../../store/envieAdd"
import styles from "./styles.module.scss"

interface Props {
    dispatch: AppDispatch
}

const AddEnvie = ({ dispatch }: Props) => {
    const [domaine, setDomaine] = useState("")
    const [envies, setEnvies] = useState("")
    const [precisions, setPrecisions] = useState("")
    const [equipes, setEquipes] = useState([""])
    const [dateAjout, setDateAjout] = useState("")

    const onDomaineChanged = (e: React.ChangeEvent<HTMLInputElement>) => setDomaine(e.target.value)
    const onEnviesChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setEnvies(e.target.value)
    const onPrecisionsChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setPrecisions(e.target.value)
    const onEquipesChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setEquipes(e.target.value.split(/, ?/))
    const onDateAjoutChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setDateAjout(e.target.value)

    const onSavePostClicked = () => {
        if (domaine && envies) {
            dispatch(
                postEnvie({
                    domaine,
                    envies,
                    precisions,
                    equipes,
                    dateAjout,
                })
            )

            setDomaine("")
            setEnvies("")
            setPrecisions("")
            setEquipes([""])
            setDateAjout("")
        } else {
            toast.warning("Il faut au moins préciser un domaine et l'envie", {
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
        <section className={styles.EnvieList}>
            <h2>Ajouter une nouvelle envie</h2>
            <form>
                <label htmlFor="postDomaine">
                    Domaine:
                    <input
                        type="text"
                        id="postDomaine"
                        name="postDomaine"
                        value={domaine}
                        onChange={onDomaineChanged}
                    />
                </label>
                <label htmlFor="postEnvies">
                    Envies:
                    <textarea
                        id="postEnvies"
                        name="postEnvies"
                        value={envies}
                        onChange={onEnviesChanged}
                    />
                </label>
                <label htmlFor="postPrecisions">
                    Precisions:
                    <textarea
                        id="postPrecisions"
                        name="postPrecisions"
                        value={precisions}
                        onChange={onPrecisionsChanged}
                    />
                </label>
                <label htmlFor="postEquipes">
                    Equipes:
                    <input
                        type="text"
                        id="postEquipes"
                        name="postEquipes"
                        value={equipes.join(", ")}
                        onChange={onEquipesChanged}
                    />
                </label>
                <label htmlFor="postDateAjout">
                    DateAjout:
                    <input
                        type="date"
                        id="postDateAjout"
                        name="postDateAjout"
                        value={dateAjout}
                        onChange={onDateAjoutChanged}
                    />
                </label>
                <button type="button" onClick={onSavePostClicked}>
                    Save Post
                </button>
            </form>
        </section>
    )
}
export default memo(AddEnvie)
