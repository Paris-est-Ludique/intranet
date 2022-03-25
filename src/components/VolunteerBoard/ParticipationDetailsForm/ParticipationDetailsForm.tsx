import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import get from "lodash/get"
import set from "lodash/set"
import styles from "./styles.module.scss"
import { tshirtSizes, useUserParticipationDetails } from "../participationDetails.utils"
import FormButton from "../../Form/FormButton/FormButton"
import { fetchVolunteerParticipationDetailsSetIfNeed } from "../../../store/volunteerParticipationDetailsSet"
import IgnoreButton from "../../Form/IgnoreButton/IgnoreButton"

type Props = {
    children?: ReactNode | undefined
    afterSubmit?: () => void | undefined
}

const ParticipationDetailsForm: FC<Props> = ({ children, afterSubmit }): JSX.Element | null => {
    const sizeRef = useRef<HTMLSelectElement | null>(null)
    const dietRef = useRef<HTMLTextAreaElement | null>(null)
    const [tshirtCountState, setTshirtCount] = useState<number>(0)
    const [adultState, setAdult] = useState<number>(0)

    const [participationDetails, saveParticipationDetails] = useUserParticipationDetails()

    const onSubmit = useCallback(() => {
        const tshirtSize = get(sizeRef, "current.value", "")
        const food = get(dietRef, "current.value", "")
        saveParticipationDetails({
            tshirtSize,
            tshirtCount: tshirtCountState,
            adult: adultState,
            food,
        })
        if (afterSubmit) afterSubmit()
    }, [tshirtCountState, adultState, saveParticipationDetails, afterSubmit])

    const onTshirtCountChange = useCallback(
        (value) => {
            setTshirtCount(value)
        },
        [setTshirtCount]
    )

    const onAdultChange = useCallback(
        (value) => {
            setAdult(value)
        },
        [setAdult]
    )

    useEffect(() => {
        const tshirtSize = get(participationDetails, "tshirtSize", "")
        const tshirtCount = get(participationDetails, "tshirtCount", "")
        const adult = get(participationDetails, "adult", "")
        const food = get(participationDetails, "food", "")

        if (tshirtSize) set(sizeRef, "current.value", tshirtSize)
        if (tshirtCount) setTshirtCount(tshirtCount)
        if (adult) setAdult(adult)
        if (food) set(dietRef, "current.value", food)
    }, [setTshirtCount, setAdult, participationDetails])

    return (
        <div>
            <div className={styles.title}>Mes infos logistiques</div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.tshirtCountTitle}>Combien as-tu de t-shirts PeL ?</div>
                </div>
                <div className={styles.rightCol}>
                    <label className={styles.tshirtCountLabel}>
                        <input
                            type="radio"
                            name="tshirtCount"
                            onChange={() => onTshirtCountChange(0)}
                            checked={tshirtCountState === 0}
                        />{" "}
                        Aucun
                    </label>
                    <label className={styles.tshirtCountLabel}>
                        <input
                            type="radio"
                            name="tshirtCount"
                            onChange={() => onTshirtCountChange(1)}
                            checked={tshirtCountState === 1}
                        />{" "}
                        Un seul
                    </label>
                    <label className={styles.tshirtCountLabel}>
                        <input
                            type="radio"
                            name="tshirtCount"
                            onChange={() => onTshirtCountChange(2)}
                            checked={tshirtCountState === 2}
                        />{" "}
                        Au moins deux
                    </label>
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <label htmlFor="tshirtSize" className={styles.tshirtSizesTitle}>
                        Quelle est ta taille de t-shirt ?
                    </label>
                </div>
                <div className={styles.rightCol}>
                    <label className={styles.tshirtSizeLabel}>
                        <select id="tshirtSize" ref={sizeRef} className={styles.tshirtCountSelect}>
                            {tshirtSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.adultTitle}>Seras-tu majeur·e au 2 juillet 2022 ?</div>
                </div>
                <div className={styles.rightCol}>
                    <label className={styles.adultLabel}>
                        <input
                            type="radio"
                            name="majority"
                            onChange={() => onAdultChange(0)}
                            checked={adultState === 0}
                        />{" "}
                        Non, je serai mineur·e
                    </label>
                    <label className={styles.adultLabel}>
                        <input
                            type="radio"
                            name="majority"
                            onChange={() => onAdultChange(1)}
                            checked={adultState === 1}
                        />{" "}
                        Oui, je serai majeur·e
                    </label>
                </div>
            </div>
            <div className={styles.dietWrapper}>
                <label htmlFor="diet">Préférence alimentaire ?</label>
                <textarea id="diet" ref={dietRef} placeholder="végétarien ? halal ? ..." />
            </div>
            <div className={styles.buttonWrapper}>
                <FormButton onClick={onSubmit}>Enregistrer</FormButton>
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

ParticipationDetailsForm.defaultProps = {
    children: undefined,
    afterSubmit: undefined,
}

export default memo(ParticipationDetailsForm)

// Fetch server-side data here
export const fetchFor = [fetchVolunteerParticipationDetailsSetIfNeed]
