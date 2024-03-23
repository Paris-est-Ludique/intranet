import { cloneDeep, pull, sortBy } from "lodash"
import React, { memo, useCallback, useEffect, useState } from "react"
import classnames from "classnames"
import styles from "./styles.module.scss"
import { DetailedBox } from "../../services/boxes"
import { VolunteerKnowledge, VolunteerKnowledgeWithoutId } from "../../services/volunteers"

interface Props {
    detailedBox: DetailedBox
    volunteerKnowledge: VolunteerKnowledge | undefined
    saveVolunteerKnowledge: (newVolunteerKnowledge: VolunteerKnowledge) => void
}

const BoxItem: React.FC<Props> = ({
    detailedBox,
    volunteerKnowledge,
    saveVolunteerKnowledge,
}): JSX.Element => {
    type ChoiceValue = keyof VolunteerKnowledgeWithoutId | "unknown"
    const [choice, setChoice] = useState("unknown")
    // const discordInvitation = useSelector(selectMiscDiscordInvitation)
    const { gameId, bggPhoto, title, bggId, poufpaf } = detailedBox
    const knowledgeChoices: { name: string; value: ChoiceValue }[] = [
        { name: "?", value: "unknown" },
        { name: "OK", value: "ok" },
        { name: "Bof", value: "bof" },
        { name: "Niet", value: "niet" },
    ]

    useEffect(() => {
        if (!volunteerKnowledge) return
        let providedchoice = "unknown"
        if (volunteerKnowledge.ok.includes(gameId)) providedchoice = "ok"
        if (volunteerKnowledge.bof.includes(gameId)) providedchoice = "bof"
        if (volunteerKnowledge.niet.includes(gameId)) providedchoice = "niet"
        setChoice(providedchoice)
    }, [gameId, setChoice, volunteerKnowledge])

    const onChoiceClick = useCallback(
        (value: ChoiceValue) => {
            if (!volunteerKnowledge) return
            const newVolunteerKnowledge: VolunteerKnowledge = cloneDeep(volunteerKnowledge)
            pull(newVolunteerKnowledge.ok, gameId)
            pull(newVolunteerKnowledge.bof, gameId)
            pull(newVolunteerKnowledge.niet, gameId)
            if (value !== "unknown") {
                newVolunteerKnowledge[value] = sortBy([...newVolunteerKnowledge[value], gameId])
            }
            saveVolunteerKnowledge(newVolunteerKnowledge)
        },
        [volunteerKnowledge, gameId, saveVolunteerKnowledge]
    )

    return (
        <li className={styles.boxItem}>
            <div className={styles.photoContainer}>
                <img className={styles.photo} src={bggPhoto} alt="" />
            </div>
            <div className={classnames(styles.titleContainer, poufpaf && styles.shorterTitle)}>
                <a
                    href={`https://boardgamegeek.com/boardgame/${bggId}`}
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
                <div className={poufpaf ? styles.poufpaf : styles.noPoufpaf}>&nbsp;</div>
            </a>
            <ul className={styles.knowledgeList}>
                {knowledgeChoices.map(({ name, value }) => (
                    <li key={value} className={styles.knowledgeItem}>
                        <button
                            type="button"
                            onClick={() => onChoiceClick(value)}
                            className={classnames(
                                styles.knowledgeButton,
                                styles[value],
                                choice === value && styles.active
                            )}
                        >
                            {name}
                        </button>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default memo(BoxItem)
