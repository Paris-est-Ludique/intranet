import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import classnames from "classnames"
import get from "lodash/get"
import set from "lodash/set"
import styles from "./styles.module.scss"
import { useUserHosting } from "../hosting.utils"
import FormButton from "../../Form/FormButton/FormButton"
import { fetchVolunteerHostingSetIfNeed } from "../../../store/volunteerHostingSet"
import IgnoreButton from "../../Form/IgnoreButton/IgnoreButton"

type Props = {
    children?: ReactNode | undefined
    afterSubmit?: () => void | undefined
}

const HostingForm: FC<Props> = ({ children, afterSubmit }): JSX.Element => {
    const [needsHosting, setNeedsHosting] = useState(false)
    const canHostCountRef = useRef<HTMLInputElement | null>(null)
    const distanceRef = useRef<HTMLInputElement | null>(null)
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [userWishes, saveWishes] = useUserHosting()

    const onNeedsHostingChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setNeedsHosting(e.target.checked)

    useEffect(() => {
        if (!userWishes) return
        setNeedsHosting(get(userWishes, "needsHosting", false))
        set(canHostCountRef, "current.value", `${get(userWishes, "canHostCount", 0)}`)
        set(distanceRef, "current.value", `${get(userWishes, "distanceToFestival", 0)}`)
        set(commentRef, "current.value", get(userWishes, "hostingComment", ""))
    }, [commentRef, userWishes])

    const onChoiceSubmit = useCallback(() => {
        const canHostCount = +get(canHostCountRef, "current.value", "0")
        const distanceToFestival = +get(distanceRef, "current.value", "0")
        const hostingComment = get(commentRef, "current.value", "")
        saveWishes(needsHosting, canHostCount, distanceToFestival, hostingComment)
        if (afterSubmit) afterSubmit()
    }, [needsHosting, commentRef, saveWishes, afterSubmit])

    return (
        <div>
            <div className={styles.title}>Mes jours de présence</div>
            <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                <div className={styles.leftCol}>
                    <div className={styles.needsHostingTitle}>
                        Cela t'arrangerait-il d'avoir un hébergement proche du festival ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <label className={styles.needsHostingLabel}>
                        <input
                            type="checkbox"
                            value="oui"
                            name="needsHosting"
                            onChange={onNeedsHostingChange}
                            checked={needsHosting}
                        />{" "}
                        Oui
                    </label>
                </div>
            </div>
            {needsHosting && (
                <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                    <div>
                        Il nous serait utile de savoir à quelle temps de transport tu te trouves
                        pour privilégier les bénévoles qui viennent de province à ceux qui viennent
                        de l'autre bout de Paris.
                    </div>
                </div>
            )}
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.canHostCountTitle}>
                        Combien de bénévoles peux-tu héberger confortablement ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <input className={styles.canHostCountLabel} type="text" ref={canHostCountRef} />
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.distanceToFestivalTitle}>
                        À combien de minutes de transport es-tu du festival ? (En voiture si tu es
                        en voiture, à vélo si tu as des vélos, sinon en transport en commun.)
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <input
                        className={styles.distanceToFestivalLabel}
                        type="text"
                        ref={distanceRef}
                    />
                </div>
            </div>
            <div className={styles.hostingCommentWrapper}>
                <label htmlFor="hosting-comment">Un commentaire, une précision ?</label>
                <textarea id="hosting-comment" ref={commentRef} />
            </div>
            <div className={styles.buttonWrapper}>
                <FormButton onClick={onChoiceSubmit}>Enregistrer</FormButton>
                {children === undefined && (
                    <>
                        {" "}
                        <FormButton onClick={afterSubmit} type="grey">
                            Annuler
                        </FormButton>{" "}
                    </>
                )}
                {children !== undefined && (
                    <>
                        {" "}
                        <IgnoreButton onClick={afterSubmit} text="Ignorer">
                            {children}
                        </IgnoreButton>{" "}
                    </>
                )}
            </div>
        </div>
    )
}

HostingForm.defaultProps = {
    children: undefined,
    afterSubmit: undefined,
}

export default memo(HostingForm)

// Fetch server-side data here
export const fetchFor = [fetchVolunteerHostingSetIfNeed]
