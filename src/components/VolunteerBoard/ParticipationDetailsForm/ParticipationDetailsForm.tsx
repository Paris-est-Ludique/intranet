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
    const [adultState, setAdult] = useState<number>(0)

    const [participationDetails, saveParticipationDetails] = useUserParticipationDetails()

    const onSubmit = useCallback(() => {
        const tshirtSize = get(sizeRef, "current.value", "")
        saveParticipationDetails(tshirtSize, adultState)
        if (afterSubmit) afterSubmit()
    }, [adultState, saveParticipationDetails, afterSubmit])

    const onAdultChange = useCallback(
        (value: number) => {
            setAdult(value)
        },
        [setAdult]
    )

    useEffect(() => {
        const tshirtSize = get(participationDetails, "tshirtSize", "")
        const adult = get(participationDetails, "adult", "")

        if (tshirtSize) set(sizeRef, "current.value", tshirtSize)
        if (adult) setAdult(adult)
    }, [setAdult, participationDetails])

    return (
        <div>
            <div className={styles.title}>Mes infos logistiques</div>

            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.adultTitle}>Seras-tu majeur·e au 1 juillet 2024 ?</div>
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

            <div>
                Cette année comme il y a de nouveaux tee-shirts avec un col en V, tous les bénévoles
                peuvent en commander un !<br />
                Autre nouveauté, il y a des tee-shirts taille enfant !
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <label htmlFor="tshirtSize" className={styles.tshirtSizesTitle}>
                        Que veux-tu comme tee-shirt ?
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
                        <IgnoreButton onClick={afterSubmit} text="Ignorer pour l'instant">
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
