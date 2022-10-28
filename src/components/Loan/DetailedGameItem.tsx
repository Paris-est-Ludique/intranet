// import { cloneDeep, pull, sortBy, uniq } from "lodash"
import { toast } from "react-toastify"
import React, { memo, useCallback, useEffect, useState } from "react"
import classnames from "classnames"
import styles from "./styles.module.scss"
import { DetailedBox } from "../../services/boxes"
import { VolunteerLoan, VolunteerLoanWithoutId } from "../../services/volunteers"

interface Props {
    detailedGame: DetailedBox
    volunteerLoan: VolunteerLoan | undefined
    saveVolunteerLoan: (newVolunteerLoan: VolunteerLoan) => void
}

const DetailedGameItem: React.FC<Props> = ({
    detailedGame,
    volunteerLoan,
    saveVolunteerLoan,
}): JSX.Element => {
    type ChoiceValue = keyof VolunteerLoanWithoutId
    const [loanable, setLoanable] = useState(false)
    const [playable, setPlayable] = useState(false)
    const [giftable, setGiftable] = useState(false)
    const [noOpinion, setNoOpinion] = useState(false)
    const { gameId, bggPhoto, title, bggId, poufpaf, bggIdAlternative } = detailedGame
    const isBggPhoto = !/^[0-9]+\.[a-zA-Z]+$/.test(bggPhoto)
    const loanChoices: { name: string; value: ChoiceValue }[] = [
        { name: "Empruntable", value: "loanable" },
        { name: "Jouable", value: "playable" },
        { name: "Offrable", value: "giftable" },
        { name: "SansAvis", value: "noOpinion" },
    ]
    const loanValues = {
        loanable,
        playable,
        giftable,
        noOpinion,
    }

    useEffect(() => {
        if (!volunteerLoan) return
        setLoanable(volunteerLoan.loanable.includes(gameId))
        setPlayable(volunteerLoan.playable.includes(gameId))
        setGiftable(volunteerLoan.giftable.includes(gameId))
        setNoOpinion(volunteerLoan.noOpinion.includes(gameId))
    }, [gameId, volunteerLoan])

    const onChoiceClick = useCallback(
        (_value: ChoiceValue) => {
            toast.warning("Il n'est plus possible de changer ses choix", {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        },
        []

        // (value: ChoiceValue) => {
        //     if (!volunteerLoan) return
        //     const adding = !volunteerLoan[value].includes(gameId)
        //     const newVolunteerLoan: VolunteerLoan = cloneDeep(volunteerLoan)
        //     if (adding) {
        //         newVolunteerLoan[value] = sortBy(uniq([...newVolunteerLoan[value], gameId]))
        //     } else {
        //         pull(newVolunteerLoan[value], gameId)
        //     }

        //     if (adding && value === "noOpinion") {
        //         pull(newVolunteerLoan.loanable, gameId)
        //         pull(newVolunteerLoan.playable, gameId)
        //         pull(newVolunteerLoan.giftable, gameId)
        //     } else {
        //         pull(newVolunteerLoan.noOpinion, gameId)
        //     }
        //     saveVolunteerLoan(newVolunteerLoan)
        // },
        // [volunteerLoan, gameId, saveVolunteerLoan]
    )

    // Just to keep saveVolunteerLoan necessary to prevent errors while changes are prevented
    if (!saveVolunteerLoan) {
        console.log("")
    }

    const onCheckboxChange = useCallback(() => {
        // Do nothing
    }, [])

    return (
        <>
            <li className={classnames(styles.boxItem, !volunteerLoan && styles.hide)}>
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
                <ul className={styles.loanList}>
                    {loanChoices.map(({ name, value }) => (
                        <li key={value} className={styles.loanItem}>
                            <button
                                type="button"
                                onClick={() => onChoiceClick(value)}
                                className={classnames(
                                    styles.loanButton,
                                    styles[value],
                                    loanValues[value] && styles.active
                                )}
                                data-message={name}
                            >
                                <input
                                    type="checkbox"
                                    className={styles.loanCheckbox}
                                    checked={loanValues[value]}
                                    onChange={() => onCheckboxChange()}
                                />
                                <div
                                    className={classnames(
                                        styles.loanCheckboxImg,
                                        styles[`${value}Checkbox`]
                                    )}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            </li>
        </>
    )
}

export default memo(DetailedGameItem)
