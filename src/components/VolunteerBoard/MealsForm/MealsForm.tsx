import get from 'lodash/get'
import set from 'lodash/set'
import type { FC, ReactNode } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import type { MealOption } from '../meals.utils'
import { mealDays, useUserMeals } from '../meals.utils'
import FormButton from '../../Form/FormButton/FormButton'
import IgnoreButton from '../../Form/IgnoreButton/IgnoreButton'
import { useUserDayWishes } from '../daysWishes.utils'
import styles from './styles.module.scss'
import { fetchVolunteerMealsSetIfNeed } from '@/store/volunteerMealsSet'
import { fetchVolunteerDayWishesSetIfNeed } from '@/store/volunteerDayWishesSet'

interface Props {
  children?: ReactNode | undefined
  afterSubmit?: () => void | undefined
}

const MealsForm: FC<Props> = ({ children, afterSubmit }): JSX.Element => {
  const [saturdayLunchMeal, setSaturdayLunchMeal] = useState('')
  const [saturdayDinnerMeal, setSaturdayDinnerMeal] = useState('')
  const [sundayLunchMeal, setSundayLunchMeal] = useState('')
  const [sundayDinnerMeal, setSundayDinnerMeal] = useState('')
  const [userMeals, saveMeals] = useUserMeals()
  const [userWishes] = useUserDayWishes()
  const meals = get(userMeals, 'meals', [])
  const dayWishesString = get(userWishes, 'dayWishes', []) as string[]
  const foodRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setSaturdayLunchMeal(meals[0] || '')
    setSaturdayDinnerMeal(meals[1] || '')
    setSundayLunchMeal(meals[2] || '')
    setSundayDinnerMeal(meals[3] || '')
    set(foodRef, 'current.value', get(userMeals, 'food', ''))
  }, [meals, userMeals])

  const onChoiceSubmit = useCallback(() => {
    const food = get(foodRef, 'current.value', '')

    saveMeals([saturdayLunchMeal, saturdayDinnerMeal, sundayLunchMeal, sundayDinnerMeal], food)
    if (afterSubmit) {
      afterSubmit()
    }
  }, [saveMeals, saturdayLunchMeal, saturdayDinnerMeal, sundayLunchMeal, sundayDinnerMeal, afterSubmit])

  const getBreakfeastElement = (dayName: string): JSX.Element => (
    <div key={`${dayName}Matin`}>
      <b>
        {dayName}
        {' '}
        matin
      </b>
      , petit dej avec jus, café, thé, brioche, quatre-quart.
    </div>
  )

  const getMealElement = (i: number, meal: string, setMeal: (m: string) => void): JSX.Element => (
    <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
      <div className={styles.leftCol}>
        <div className={styles.needsMealsTitle}>
          <b>{mealDays[i].name}</b>
          {' '}
          :
        </div>
      </div>
      <div className={styles.rightCol}>
        {mealDays[i].options.map((option: MealOption) => (
          <label
            className={styles.mealsLabel}
            key={option.abbr}
          >
            <input
              type="radio"
              name={`meal${i}`}
              onChange={() => setMeal(option.abbr)}
              checked={meal === option.abbr}
            />
            {' '}
            {option.title}
          </label>
        ))}
      </div>
    </div>
  )

  const getNotVolunteerElement = (dayName: string): JSX.Element => (
    <div key={dayName}>
      <b>
        {dayName}
        {' '}
        matin/midi/soir
      </b>
      , comme tu n'es pas bénévole ce jour-là, on a rien prévu. Mais
      {' '}
      <a
        href="mailto:benevoles@parisestludique.fr"
        target="_blank"
        rel="noreferrer"
      >
        contacte-nous
      </a>
      {' '}
      si tu veux qu'on te prévoie un dîner.
      {' '}
      {dayName === 'Dimanche' && (
        <>Surtout dimanche soir si tu redeviens bénévole pour nous aider à ranger un peu le festival !</>
      )}
    </div>
  )

  return (
    <div>
      <div className={styles.title}>Mes repas</div>
      <div className={classnames(styles.inputWrapper)}>
        <div>
          La composition exacte des repas ne sera pas connues avant le festival (risque de changement d'ingrédient au
          dernier moment). Elle sera disponible au moment de récupérer ton repas pour que tu puisses contrôler l'absence
          d'allergène.
        </div>
      </div>
      {dayWishesString.includes('S')
        ? (
          <>
            {getBreakfeastElement('Samedi')}
            {getMealElement(0, saturdayLunchMeal, setSaturdayLunchMeal)}
            {getMealElement(1, saturdayDinnerMeal, setSaturdayDinnerMeal)}
          </>
          )
        : (
            getNotVolunteerElement('Samedi')
          )}
      <br />
      <br />
      <br />
      {dayWishesString.includes('D')
        ? (
          <>
            {getBreakfeastElement('Dimanche')}
            {getMealElement(2, sundayLunchMeal, setSundayLunchMeal)}
            {getMealElement(3, sundayDinnerMeal, setSundayDinnerMeal)}
          </>
          )
        : (
            getNotVolunteerElement('Dimanche')
          )}

      <div className={classnames(styles.inputWrapper)}>
        <div>
          <b>Jeudi, vendredi et lundi</b>
          , cocktail dejeunatoire avec salades composées, charcuterie, fromage...
        </div>
      </div>

      <div className={styles.foodWrapper}>
        <label htmlFor="food">As-tu des restrictions alimentaires ?</label>
        <textarea
          id="food"
          ref={foodRef}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <FormButton onClick={onChoiceSubmit}>Enregistrer</FormButton>
        {children === undefined && (
          <>
            {' '}
            <FormButton
              onClick={afterSubmit}
              type="grey"
            >
              Annuler
            </FormButton>
            {' '}
          </>
        )}
        {children !== undefined && (
          <>
            {' '}
            <IgnoreButton
              onClick={afterSubmit}
              text="Ignorer pour l'instant"
            >
              {children}
            </IgnoreButton>
            {' '}
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

export const fetchForMealsForm = [fetchVolunteerMealsSetIfNeed, fetchVolunteerDayWishesSetIfNeed]
