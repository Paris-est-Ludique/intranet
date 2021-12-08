import React, { useState, memo } from "react"
import { toast } from "react-toastify"
import styles from "./styles.module.scss"

import { AppDispatch } from "../../store"
import { fetchWishAdd } from "../../store/wishAdd"

interface Props {
    dispatch: AppDispatch
}

const WishAdd = ({ dispatch }: Props) => {
    const [domain, setDomain] = useState("")
    const [wish, setWish] = useState("")
    const [details, setDetails] = useState("")
    const [teams, setTeams] = useState([""])
    const [addedDate, setAddedDate] = useState("")

    const onDomainChanged = (e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)
    const onWishChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setWish(e.target.value)
    const onDetailsChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setDetails(e.target.value)
    const onTeamsChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTeams(e.target.value.split(/, ?/))
    const onAddedDateChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setAddedDate(e.target.value)

    const onSavePostClicked = () => {
        if (domain && wish) {
            dispatch(
                fetchWishAdd({
                    domain,
                    wish,
                    details,
                    teams,
                    addedDate,
                })
            )

            setDomain("")
            setWish("")
            setDetails("")
            setTeams([""])
            setAddedDate("")
        } else {
            toast.warning("Il faut au moins préciser un domain et l'wish", {
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
        <section className={styles.WishList}>
            <h2>Ajouter une nouvelle wish</h2>
            <form>
                <label htmlFor="postDomain">
                    Domaine:
                    <input
                        type="text"
                        id="postDomain"
                        name="postDomain"
                        value={domain}
                        onChange={onDomainChanged}
                    />
                </label>
                <label htmlFor="postWish">
                    Envies:
                    <textarea id="postWish" name="postWish" value={wish} onChange={onWishChanged} />
                </label>
                <label htmlFor="postDetails">
                    Precisions:
                    <textarea
                        id="postDetails"
                        name="postDetails"
                        value={details}
                        onChange={onDetailsChanged}
                    />
                </label>
                <label htmlFor="postTeams">
                    Equipes:
                    <input
                        type="text"
                        id="postTeams"
                        name="postTeams"
                        value={teams.join(", ")}
                        onChange={onTeamsChanged}
                    />
                </label>
                <label htmlFor="postAddedDate">
                    Date dajout:
                    <input
                        type="date"
                        id="postAddedDate"
                        name="postAddedDate"
                        value={addedDate}
                        onChange={onAddedDateChanged}
                    />
                </label>
                <button type="button" onClick={onSavePostClicked}>
                    Save Post
                </button>
            </form>
        </section>
    )
}
export default memo(WishAdd)
