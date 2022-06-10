import { FC, memo, useCallback } from "react"
import { find, get } from "lodash"
import styles from "./styles.module.scss"
import { useUserMeals, mealDays, MealOption } from "../meals.utils"
import useAction from "../../../utils/useAction"
import { displayModal, MODAL_IDS } from "../../../store/ui"
import { useUserDayWishes } from "../daysWishes.utils"

const Meals: FC = (): JSX.Element | null => {
    const [userMeals] = useUserMeals()
    const [userWishes] = useUserDayWishes()
    const meals = get(userMeals, "meals", [])
    const dayWishesString = get(userWishes, "dayWishes", [])
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.MEALS), [execDisplayModal])
    const mealChoices = mealDays.map((meal, i: number) =>
        find(meal.options, { abbr: meals[i] || "" })
    ) as MealOption[]

    function getMealElement(i: number): JSX.Element {
        const mealChoice = mealChoices[i]
        return (
            <div className={styles.mealsLabel} key={mealDays[i].name}>
                {mealDays[i].name}, {mealChoice.title}
            </div>
        )
    }

    return (
        <div className={styles.meals}>
            <div className={styles.title}>Mes repas</div>
            {dayWishesString.includes("S") ? (
                <>
                    {getMealElement(0)}
                    <div className={styles.mealsLabel} key="SamediSoir">
                        Samedi soir, apéro dînatoire
                    </div>
                </>
            ) : (
                <div className={styles.mealsLabel} key="Samedi">
                    Non bénévole le samedi
                </div>
            )}

            {dayWishesString.includes("D") ? (
                <>
                    {getMealElement(1)}
                    {getMealElement(2)}
                </>
            ) : (
                <div className={styles.mealsLabel} key="Dimanche">
                    Non bénévole le dimanche
                </div>
            )}

            <div className={styles.editButton} key="edit">
                <button type="button" onClick={onEdit}>
                    Modifier
                </button>
            </div>
        </div>
    )
}

export default memo(Meals)
