import React, { useState, memo } from "react"
import { toast } from "react-toastify"

import { AppDispatch } from "../../store"

import { fetchVolunteerSet } from "../../store/volunteerSet"
import { Volunteer } from "../../services/volunteers"
import styles from "./styles.module.scss"

interface Props {
    dispatch: AppDispatch
    volunteer: Volunteer
}

const VolunteerSet = ({ dispatch, volunteer }: Props) => {
    const [firstname, setFirstname] = useState(volunteer.firstname)
    const [lastname, setName] = useState(volunteer.lastname)
    const [adult, setAdult] = useState(volunteer.adult)

    const onFirstnameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFirstname(e.target.value)
    const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    const onAdultChanged = (e: React.ChangeEvent<HTMLInputElement>) => setAdult(+e.target.value)

    const onSavePostClicked = () => {
        if (firstname && lastname) {
            dispatch(
                fetchVolunteerSet({
                    ...volunteer,
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
        <section className={styles.VolunteerList}>
            <h2>Modifier un volunteer</h2>
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
export default memo(VolunteerSet)
