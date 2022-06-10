import { get } from "lodash"
import { FC, memo, ReactNode, useCallback, useEffect, useState } from "react"
import classnames from "classnames"
import styles from "./styles.module.scss"
import { mealDays, MealOption, useUserMeals } from "../meals.utils"
import FormButton from "../../Form/FormButton/FormButton"
import { fetchVolunteerMealsSetIfNeed } from "../../../store/volunteerMealsSet"
import IgnoreButton from "../../Form/IgnoreButton/IgnoreButton"
import { useUserDayWishes } from "../daysWishes.utils"
import { fetchVolunteerDayWishesSetIfNeed } from "../../../store/volunteerDayWishesSet"

type Props = {
    children?: ReactNode | undefined
    afterSubmit?: () => void | undefined
}

const MealsForm: FC<Props> = ({ children, afterSubmit }): JSX.Element => {
    const [saturdayLunchMeal, setSaturdayLunchMeal] = useState("")
    const [sundayLunchMeal, setSundayLunchMeal] = useState("")
    const [sundayDinnerMeal, setSundayDinnerMeal] = useState("")
    const [userMeals, saveMeals] = useUserMeals()
    const [userWishes] = useUserDayWishes()
    const meals = get(userMeals, "meals", [])
    const dayWishesString = get(userWishes, "dayWishes", [])

    useEffect(() => {
        setSaturdayLunchMeal(meals[0] || "")
        setSundayLunchMeal(meals[1] || "")
        setSundayDinnerMeal(meals[2] || "")
    }, [meals])

    const onChoiceSubmit = useCallback(() => {
        saveMeals([saturdayLunchMeal, sundayLunchMeal, sundayDinnerMeal])
        if (afterSubmit) afterSubmit()
    }, [saveMeals, saturdayLunchMeal, sundayLunchMeal, sundayDinnerMeal, afterSubmit])

    const getBreakfeastElement = (dayName: string): JSX.Element => (
        <div key={`${dayName}Matin`}>
            <b>{dayName} matin</b>, petit dej à 8h avec jus de pomme, multifruit, café, brioches et
            quatre-quarts, crêpes si bénévoles motivés.
        </div>
    )

    const getMealElement = (i: number, meal: string, setMeal: (m: string) => void): JSX.Element => (
        <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
            <div className={styles.leftCol}>
                <div className={styles.needsMealsTitle}>
                    <b>{mealDays[i].name}</b>
                    {i === 0 && <>, accompagné d'un délicieux brownie tout chocolat</>}
                    {i === 1 && (
                        <>, accompagné du même brownie. Enfin, un autre que celui de la veille</>
                    )}{" "}
                    :
                </div>
            </div>
            <div className={styles.rightCol}>
                {mealDays[i].options.map((option: MealOption) => (
                    <label className={styles.mealsLabel} key={option.abbr}>
                        <input
                            type="radio"
                            name={`meal${i}`}
                            onChange={() => setMeal(option.abbr)}
                            checked={meal === option.abbr}
                        />{" "}
                        {option.title}
                    </label>
                ))}
            </div>
        </div>
    )

    const getNotVolunteerElement = (dayName: string): JSX.Element => (
        <div key={dayName}>
            <b>{dayName} matin/midi/soir</b>, comme tu n'es pas bénévole ce jour-là, on a rien
            prévu. Mais{" "}
            <a href="mailto:benevoles@parisestludique.fr" target="_blank" rel="noreferrer">
                contacte-nous
            </a>{" "}
            si tu veux qu'on te prévoie un dîner.{" "}
            {dayName === "Dimanche" && (
                <>
                    Surtout dimanche soir si tu redeviens bénévole pour nous aider à ranger un peu
                    le festival !
                </>
            )}
        </div>
    )

    return (
        <div>
            <div className={styles.title}>Mes repas</div>
            {dayWishesString.includes("S") ? (
                <>
                    {getBreakfeastElement("Samedi")}
                    {getMealElement(0, saturdayLunchMeal, setSaturdayLunchMeal)}
                    <div className={styles.mealsLabel} key="SamediSoir">
                        <b>Samedi soir</b>, apéro dînatoire
                    </div>
                </>
            ) : (
                getNotVolunteerElement("Samedi")
            )}
            <br />
            <br />
            <br />
            {dayWishesString.includes("D") ? (
                <>
                    {getBreakfeastElement("Dimanche")}
                    {getMealElement(1, sundayLunchMeal, setSundayLunchMeal)}
                    {getMealElement(2, sundayDinnerMeal, setSundayDinnerMeal)}
                </>
            ) : (
                getNotVolunteerElement("Dimanche")
            )}

            <div className={classnames(styles.inputWrapper)}>
                <div>
                    <b>Jeudi, vendredi et lundi</b>, chacun improvise. Peut-être resto à proximité.
                </div>
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

MealsForm.defaultProps = {
    children: undefined,
    afterSubmit: undefined,
}

export default memo(MealsForm)

// Fetch server-side data here
export const fetchFor = [fetchVolunteerMealsSetIfNeed, fetchVolunteerDayWishesSetIfNeed]
