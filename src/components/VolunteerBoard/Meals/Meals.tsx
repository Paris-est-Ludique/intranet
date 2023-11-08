import type { FC } from 'react'
import { memo, useCallback } from 'react'
import get from 'lodash/get'
import type { MealOption } from '../meals.utils'
import { mealDays, useUserMeals } from '../meals.utils'
import { useUserDayWishes } from '../daysWishes.utils'
import styles from './styles.module.scss'
import useAction from '@/utils/useAction'
import { MODAL_IDS, displayModal } from '@/store/ui'

const Meals: FC = (): JSX.Element | null => {
  const [userMeals] = useUserMeals()
  const [userWishes] = useUserDayWishes()
  const meals = get(userMeals, 'meals', []) as string[]
  const dayWishesString = get(userWishes, 'dayWishes', []) as string[]
  const execDisplayModal = useAction(displayModal)
  const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.MEALS), [execDisplayModal])
  const mealChoices = mealDays.map((meal, i: number) => meal.options.find(option => option.abbr === meals[i] || ''),
  ) as MealOption[]

  function getMealElement(i: number): JSX.Element {
    const mealChoice = mealChoices[i]
    return (
      <div className={styles.mealsLabel} key={mealDays[i].name}>
        {mealDays[i].name}
        ,
        {mealChoice.title}
      </div>
    )
  }

  return (
    <div className={styles.meals}>
      <div className={styles.title}>Mes repas</div>
      {dayWishesString.includes('S')
        ? (
          <>
            {getMealElement(0)}
            {getMealElement(1)}
          </>
          )
        : (
          <div className={styles.mealsLabel} key="Samedi">
            Non bénévole le samedi
          </div>
          )}

      {dayWishesString.includes('D')
        ? (
          <>
            {getMealElement(2)}
            {getMealElement(3)}
          </>
          )
        : (
          <div className={styles.mealsLabel} key="Dimanche">
            Non bénévole le dimanche
          </div>
          )}

      <div className={styles.editButton} key="edit">
        <button type="button" onClick={onEdit}>
          Modifier
        </button>
      </div>
      {/* <div className={styles.editButton} key="edit">
                Plus modifiable
            </div> */}
    </div>
  )
}

export default memo(Meals)
