import type { FC, ReactNode } from 'react'
import { memo, useCallback, useEffect, useRef } from 'react'
import get from 'lodash/get'
import set from 'lodash/set'
import { useRetex } from '../retex.utils'
import FormButton from '../../Form/FormButton/FormButton'
import IgnoreButton from '../../Form/IgnoreButton/IgnoreButton'
import styles from './styles.module.scss'
import { fetchRetexSetIfNeed } from '@/store/retexSet'

interface Props {
  children?: ReactNode | undefined
  afterSubmit?: () => void | undefined
}

const RetexForm: FC<Props> = ({ children, afterSubmit }): JSX.Element | null => {
  const question2Ref = useRef<HTMLTextAreaElement | null>(null)
  const question3Ref = useRef<HTMLTextAreaElement | null>(null)
  const question4Ref = useRef<HTMLTextAreaElement | null>(null)
  const question5Ref = useRef<HTMLTextAreaElement | null>(null)
  const question6Ref = useRef<HTMLTextAreaElement | null>(null)
  const question7Ref = useRef<HTMLTextAreaElement | null>(null)
  const question8Ref = useRef<HTMLTextAreaElement | null>(null)
  const question9Ref = useRef<HTMLTextAreaElement | null>(null)

  const [retex, saveRetex] = useRetex()
  const dayWishes = get(retex, 'dayWishes', '')
  const weekDaysText = `,${dayWishes}`
    .replace(/,S|,D/g, '')
    .replace('M', 'mercredi')
    .replace('J', 'jeudi')
    .replace('V', 'vendredi')
    .replace('L', 'lundi')
    .replace(/^,/, '')
  const weekDays = weekDaysText ? weekDaysText.split(',') : []

  const onSubmit = useCallback(() => {
    if (!retex) {
      return
    }
    const question2 = get(question2Ref, 'current.value', '')
    const question3 = get(question3Ref, 'current.value', '')
    const question4 = get(question4Ref, 'current.value', '')
    const question5 = get(question5Ref, 'current.value', '')
    const question6 = get(question6Ref, 'current.value', '')
    const question7 = get(question7Ref, 'current.value', '')
    const question8 = get(question8Ref, 'current.value', '')
    const question9 = get(question9Ref, 'current.value', '')
    saveRetex(
      retex.id,
      question2,
      question3,
      question4,
      question5,
      question6,
      question7,
      question8,
      question9,
    )
    if (afterSubmit)
      afterSubmit()
  }, [afterSubmit, retex, saveRetex])

  const preAnswer = useCallback(
    (ref: React.MutableRefObject<HTMLTextAreaElement | null>) =>
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const answer = e.currentTarget.textContent
        const currentAnswer = get(ref, 'current.value', '')
        const newAnswer = `${currentAnswer}${currentAnswer ? '\n' : ''}${answer.replace(
                    /_+$/,
                    '',
                )}`
        set(ref, 'current.value', newAnswer)
        ref?.current?.focus()
      },
    [],
  )

  useEffect(() => {
    const question2 = get(retex, 'question2', '')
    const question3 = get(retex, 'question3', '')
    const question4 = get(retex, 'question4', '')
    const question5 = get(retex, 'question5', '')
    const question6 = get(retex, 'question6', '')
    const question7 = get(retex, 'question7', '')
    const question8 = get(retex, 'question8', '')
    const question9 = get(retex, 'question9', '')

    if (question2)
      set(question2Ref, 'current.value', question2)
    if (question3)
      set(question3Ref, 'current.value', question3)
    if (question4)
      set(question4Ref, 'current.value', question4)
    if (question5)
      set(question5Ref, 'current.value', question5)
    if (question6)
      set(question6Ref, 'current.value', question6)
    if (question7)
      set(question7Ref, 'current.value', question7)
    if (question8)
      set(question8Ref, 'current.value', question8)
    if (question9)
      set(question9Ref, 'current.value', question9)
  }, [retex])

  return (
    <div>
      <div className={styles.title}>Retour sur PeL 2022</div>

      <div className={styles.questionWrapper}>
        On aimerait savoir comment s'est passé ton festival !
        <br />
        L'orga lira tes réponses et répondra à son tour à tes questions soit
        individuellement, soit dans la prochaine gazette. Puis toutes les réponses seront
        anonymisées et une synthèse sera diffusée dans la gazette.
        <br />
        Tu peux répondre par 3 mots ou 3 pages, on a tous vécu le festival différemment !
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question2">
          As-tu un avis positif/négatif ou une recommandation au sujet des repas, des WC,
          de tes besoins en tee-shirt, chapeau, eau, bière, crème solaire ?
        </label>
        <div className={styles.preAnswerWrapper}>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question2Ref)}
          >
            Tout était top.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question2Ref)}
          >
            On m’a rapporté que __
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question2Ref)}
          >
            J’ai eu un problème concernant __
          </button>
        </div>
        <textarea id="question2" ref={question2Ref} placeholder="..." />
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question3">
          As-tu, comme prévu et en accord avec ton équipe, pris du temps pour profiter des
          espaces visiteurs du festival, des badges inter-équipes, des crêpes/glaces à
          l’espace bénévole ?
        </label>
        <div className={styles.preAnswerWrapper}>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question3Ref)}
          >
            J’ai joué X temps sur des stands éditeurs.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question3Ref)}
          >
            Je me suis baladé sans jouer.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question3Ref)}
          >
            Il y avait des crêpes ?
          </button>
        </div>
        <textarea id="question3" ref={question3Ref} placeholder="..." />
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question4">
          Gestion du stress, de la fatigue : as-tu fait des pauses (à notre espace sieste,
          à l’espace Shiatsu) ? T’es-tu senti épuisé lors du festival, après, et sais-tu
          pourquoi ?
        </label>
        <div className={styles.preAnswerWrapper}>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question4Ref)}
          >
            J’étais en forme tout du long.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question4Ref)}
          >
            Les jours de préparatifs m’ont fatigués.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question4Ref)}
          >
            Il y avait des massages gratuits ?
          </button>
        </div>
        <textarea id="question4" ref={question4Ref} placeholder="..." />
      </div>

      {weekDays.length > 0 && (
        <div className={styles.questionWrapper}>
          <label htmlFor="question5">
            {weekDays.length > 1
              ? `Comment se sont passés les ${weekDays.join(', ')} ?`
              : `Comment s'est passé le ${weekDays.join(', ')} ?`}
            {' '}
            As-tu eu assez d’infos, te sentais-tu utile ? Y compris au sein de ton
            équipe ?
          </label>
          <div className={styles.preAnswerWrapper}>
            <button
              type="button"
              className={styles.preAnswerButton}
              onClick={preAnswer(question5Ref)}
            >
              Je n’ai pas pu venir.
            </button>
            <button
              type="button"
              className={styles.preAnswerButton}
              onClick={preAnswer(question5Ref)}
            >
              Je n’ai pas arrêté.
            </button>
            <button
              type="button"
              className={styles.preAnswerButton}
              onClick={preAnswer(question5Ref)}
            >
              Je manquais d’infos.
            </button>
          </div>
          <textarea id="question5" ref={question5Ref} placeholder="..." />
        </div>
      )}

      <div className={styles.questionWrapper}>
        <label htmlFor="question6">
          As-tu trouvé ton compte vis-à-vis des raisons qui t'ont poussées à être bénévole
          (faire découvrir sa passion, se rendre utile, découvrir l’envers du décor,
          sympathiser, apprendre, simplement kiffer, etc) ?
        </label>
        <div className={styles.preAnswerWrapper}>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question6Ref)}
          >
            Oui, objectifs atteints.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question6Ref)}
          >
            Je n’avais pas d’attente.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question6Ref)}
          >
            Il m’a manqué __
          </button>
        </div>
        <textarea id="question6" ref={question6Ref} placeholder="..." />
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question7">
          Si d’autres bénévoles sont partants pour te soutenir, que mettrais-tu en œuvre
          autrement ou mieux pour la prochaine édition du festival ?
        </label>
        <div className={styles.preAnswerWrapper}>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question7Ref)}
          >
            Dans l’équipe __ j’aimerais __
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question7Ref)}
          >
            B. La réponse B.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question7Ref)}
          >
            Je manque de temps.
          </button>
        </div>
        <textarea id="question7" ref={question7Ref} placeholder="..." />
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question8">
          Envisages-tu d’être bénévole pour PeL 2023 ? Dans la même équipe, ou tu aurais
          envie d’en changer ? Libre à toi d’expliquer ou non pourquoi.
        </label>
        <div className={styles.preAnswerWrapper}>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question8Ref)}
          >
            Oui, si je suis dispo.
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question8Ref)}
          >
            Oui, mais dans l’équipe __
          </button>
          <button
            type="button"
            className={styles.preAnswerButton}
            onClick={preAnswer(question8Ref)}
          >
            Hélas non.
          </button>
        </div>
        <textarea id="question8" ref={question8Ref} placeholder="..." />
      </div>

      <div className={styles.questionWrapper}>
        <label htmlFor="question9">
          As-tu un conseil, une remarque, une idée non couverte par les précédentes
          questions ? Laisse ton imagination déborder ^^
        </label>
        <textarea id="question9" ref={question9Ref} placeholder="..." />
      </div>

      <div className={styles.buttonWrapper}>
        <FormButton onClick={onSubmit}>Enregistrer</FormButton>
        {children === undefined && (
          <>
            {' '}
            <FormButton onClick={afterSubmit} type="grey">
              Annuler
            </FormButton>
            {' '}
          </>
        )}
        {children !== undefined && (
          <>
            {' '}
            <IgnoreButton onClick={afterSubmit} text="Ignorer pour l'instant">
              {children}
            </IgnoreButton>
            {' '}
          </>
        )}
      </div>
    </div>
  )
}

RetexForm.defaultProps = {
  children: undefined,
  afterSubmit: undefined,
}

export default memo(RetexForm)

export const fetchForRetexForm = [fetchRetexSetIfNeed]
