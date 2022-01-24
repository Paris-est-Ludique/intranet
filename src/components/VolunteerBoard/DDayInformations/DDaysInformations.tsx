import { FC, memo, useCallback, useRef, useState } from "react"
import styles from "./styles.module.scss"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const DDayInformations: FC = (): JSX.Element | null => {
    const sizeRef = useRef<HTMLSelectElement | null>(null)
    const dietRef = useRef<HTMLInputElement | null>(null)
    const ageRef = useRef<HTMLInputElement | null>(null)
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [has2Shirts, setHas2Shirts] = useState<boolean | null>(null)

    const onSubmit = useCallback(() => {
        console.log("on submit")
    }, [])

    const onHas2ShirtsClick = useCallback(
        (value) => {
            setHas2Shirts(value)
        },
        [setHas2Shirts]
    )

    return (
        <div className={styles.ddayInfo}>
            <div className={styles.ddayTitle}>Informations pour le festival</div>
            <div className={styles.ddayInfoShirtWrapper}>
                <div className={styles.ddayShirtLabel}>J&apos;ai déjà 2 t-shirts</div>
                <label>
                    <input type="radio" name="hasShirt" onClick={() => onHas2ShirtsClick(true)} />{" "}
                    Oui
                </label>
                <label>
                    <input type="radio" name="hasShirt" onClick={() => onHas2ShirtsClick(false)} />{" "}
                    Non
                </label>
                {has2Shirts === false && (
                    <div className={styles.ddayShirtSizes}>
                        <label>Taille</label>
                        <select ref={sizeRef}>
                            {sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className={styles.ddayInfoInputWrapper}>
                <label htmlFor="ddday-age">Age</label>
                <input type="number" id="ddday-age" ref={ageRef} />
            </div>
            <div className={styles.ddayInfoInputWrapper}>
                <label htmlFor="dday-diet">Régime alimentaire</label>
                <input
                    id="dday-diet"
                    type="text"
                    ref={dietRef}
                    placeholder="végétarien ? halal ? ..."
                />
            </div>
            <div className={styles.ddayInfoCommentWrapper}>
                <label htmlFor="dday-comment">Des commentaires ?</label>
                <textarea id="dday-comment" ref={commentRef} />
            </div>
            <div className={styles.ddayButtonWrapper}>
                <button type="submit" onClick={onSubmit}>
                    Enregistrer
                </button>
            </div>
        </div>
    )
}

export default memo(DDayInformations)
