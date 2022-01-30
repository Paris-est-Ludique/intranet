import { FC, memo, useCallback, useEffect, useRef, useState } from "react"
import get from "lodash/get"
import set from "lodash/set"
import styles from "./styles.module.scss"
import { tShirtSizes, useUserParticipationDetails } from "../participationDetails.utils"

const ParticipationDetailsForm: FC = (): JSX.Element | null => {
    const sizeRef = useRef<HTMLSelectElement | null>(null)
    const dietRef = useRef<HTMLInputElement | null>(null)
    const ageRef = useRef<HTMLInputElement | null>(null)
    const [has2Shirts, setHas2Shirts] = useState<boolean>(true)

    const [participationDetails, saveParticipationDetails] = useUserParticipationDetails()

    const onSubmit = useCallback(() => {
        const age = get(ageRef, "current.value", "")
        const teeshirtSize = has2Shirts ? "" : get(sizeRef, "current.value", "")
        const food = get(dietRef, "current.value", "")
        saveParticipationDetails({ age, teeshirtSize, food })
    }, [has2Shirts, saveParticipationDetails])

    const onHas2ShirtsClick = useCallback(
        (value) => {
            setHas2Shirts(value)
        },
        [setHas2Shirts]
    )

    useEffect(() => {
        console.log("participationDetails", participationDetails)
        const age = get(participationDetails, "age", "")
        const teeshirtSize = get(participationDetails, "teeshirtSize", "")
        const food = get(participationDetails, "food", "")

        if (age) set(ageRef, "current.value", age)
        if (teeshirtSize) set(sizeRef, "current.value", teeshirtSize)
        setHas2Shirts(!teeshirtSize)
        if (food) set(dietRef, "current.value", food)
    }, [setHas2Shirts, participationDetails])

    return (
        <div className={styles.root}>
            <div className={styles.title}>Informations pour le festival</div>
            <div className={styles.tShirtWrapper}>
                <div className={styles.tShirtLabel}>J&apos;ai déjà 2 t-shirts</div>
                <label>
                    <input
                        type="radio"
                        name="hasShirt"
                        onClick={() => onHas2ShirtsClick(true)}
                        checked={has2Shirts}
                    />{" "}
                    Oui
                </label>
                <label>
                    <input
                        type="radio"
                        name="hasShirt"
                        onClick={() => onHas2ShirtsClick(false)}
                        checked={!has2Shirts}
                    />{" "}
                    Non
                </label>
                {has2Shirts === false && (
                    <div className={styles.tShirtSizes}>
                        <label>Taille</label>
                        <select ref={sizeRef}>
                            {tShirtSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className={styles.inputWrapper}>
                <label htmlFor="ddday-age">Age</label>
                <input type="number" id="ddday-age" ref={ageRef} />
            </div>
            <div className={styles.inputWrapper}>
                <label htmlFor="dday-diet">Préférence alimentaire</label>
                <input
                    id="dday-diet"
                    type="text"
                    ref={dietRef}
                    placeholder="végétarien ? halal ? ..."
                />
            </div>
            <div className={styles.buttonWrapper}>
                <button type="submit" onClick={onSubmit}>
                    Enregistrer
                </button>
            </div>
        </div>
    )
}

export default memo(ParticipationDetailsForm)
