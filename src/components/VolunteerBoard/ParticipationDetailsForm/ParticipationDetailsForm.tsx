import { FC, memo, useCallback, useEffect, useRef, useState } from "react"
import get from "lodash/get"
import set from "lodash/set"
import styles from "./styles.module.scss"
import {
    foodDefaultValue,
    tshirtSizes,
    useUserParticipationDetails,
} from "../participationDetails.utils"
import FormButton from "../../Form/FormButton/FormButton"

type Props = {
    afterSubmit?: () => void | undefined
}

const ParticipationDetailsForm: FC<Props> = ({ afterSubmit }): JSX.Element | null => {
    const sizeRef = useRef<HTMLSelectElement | null>(null)
    const dietRef = useRef<HTMLInputElement | null>(null)
    const [tshirtCountState, setTshirtCount] = useState<number>(0)
    const [adultState, setAdult] = useState<number>(0)

    const [participationDetails, saveParticipationDetails] = useUserParticipationDetails()

    const onSubmit = useCallback(() => {
        const tshirtSize = get(sizeRef, "current.value", "")
        const food = get(dietRef, "current.value", "") || foodDefaultValue
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
            <div className={styles.title}>Mes informations pour le festival</div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.tshirtCountTitle}>Combien as-tu de t-shirts PeL ?</div>
                </div>
                <div>
                    <label className={styles.tshirtCountLabel}>
                        <input
                            type="radio"
                            name="tshirtCount"
                            onChange={() => onTshirtCountChange(0)}
                            checked={tshirtCountState === 0}
                        />{" "}
                        0
                    </label>
                    <label className={styles.tshirtCountLabel}>
                        <input
                            type="radio"
                            name="tshirtCount"
                            onChange={() => onTshirtCountChange(1)}
                            checked={tshirtCountState === 1}
                        />{" "}
                        1
                    </label>
                    <label className={styles.tshirtCountLabel}>
                        <input
                            type="radio"
                            name="tshirtCount"
                            onChange={() => onTshirtCountChange(2)}
                            checked={tshirtCountState === 2}
                        />{" "}
                        2 ou plus
                    </label>
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.tshirtSizesTitle}>Taille</div>
                </div>
                <div>
                    <select ref={sizeRef} className={styles.tshirtCountSelect}>
                        {tshirtSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.adultTitle}>Le 2 juillet 2022 tu auras :</div>
                </div>
                <div>
                    <label className={styles.adultLabel}>
                        <input
                            type="radio"
                            name="majority"
                            onChange={() => onAdultChange(0)}
                            checked={adultState === 0}
                        />{" "}
                        17 ou moins
                    </label>
                    <label className={styles.adultLabel}>
                        <input
                            type="radio"
                            name="majority"
                            onChange={() => onAdultChange(1)}
                            checked={adultState === 1}
                        />{" "}
                        18 ans ou plus
                    </label>
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <label htmlFor="dday-diet">Préférence alimentaire</label>
                </div>
                <div>
                    <input
                        id="dday-diet"
                        type="text"
                        ref={dietRef}
                        placeholder="végétarien ? halal ? ..."
                    />
                </div>
            </div>
            <div className={styles.buttonWrapper}>
                <FormButton onClick={onSubmit}>Enregistrer</FormButton>
            </div>
        </div>
    )
}

ParticipationDetailsForm.defaultProps = {
    afterSubmit: undefined,
}

export default memo(ParticipationDetailsForm)
