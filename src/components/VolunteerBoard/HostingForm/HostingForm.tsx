import type { FC, ReactNode } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import get from 'lodash/get'
import includes from 'lodash/includes'
import without from 'lodash/without'
import set from 'lodash/set'
import type {
  NightChoices,
  NightOption,
} from '../hosting.utils'
import {
  bedList,
  hostLocations,
  nightChoiceSelectionDefaultState,
  nightList,
  useUserHosting,
} from '../hosting.utils'
import FormButton from '../../Form/FormButton/FormButton'
import IgnoreButton from '../../Form/IgnoreButton/IgnoreButton'
import styles from './styles.module.scss'
import { fetchVolunteerHostingSetIfNeed } from '@/store/volunteerHostingSet'

interface Props {
  children?: ReactNode | undefined
  afterSubmit?: () => void | undefined
}

const HostingForm: FC<Props> = ({ children, afterSubmit }): JSX.Element => {
  const [hostingType, setHostingType] = useState('')
  const canHostCountRef = useRef<HTMLInputElement | null>(null)
  const [nights, setNights] = useState(nightChoiceSelectionDefaultState)
  const cohostVolunteerRef = useRef<HTMLInputElement | null>(null)
  const petAllergiesRef = useRef<HTMLInputElement | null>(null)
  const [backProblems, setBackProblems] = useState(false)
  const [bedType, setBedType] = useState<string[]>([])
  const [isolatedBed, setIsolatedBed] = useState(false)
  const bedConfigurationRef = useRef<HTMLTextAreaElement | null>(null)
  const hostAddressRef = useRef<HTMLTextAreaElement | null>(null)
  const transportTypeRef = useRef<HTMLInputElement | null>(null)
  const [festivalProximity, setFestivalProximity] = useState('')
  const distanceToFestivalRef = useRef<HTMLInputElement | null>(null)
  const [hostingAbsoluteNeed, setHostingAbsoluteNeed] = useState(false)
  const hostingNeedReasonRef = useRef<HTMLTextAreaElement | null>(null)
  const [userWishes, saveWishes] = useUserHosting()

  useEffect(() => {
    if (!userWishes)
      return
    setHostingType(get(userWishes, 'hostingType', ''))
    const hostingNights = get(userWishes, 'hostingNights', '') as string
    const newNights = hostingNights.split('').reduce(
      (acc: NightChoices, abbr: string) => ({
        ...acc,
        [abbr]: true,
      }),
      {} as NightChoices,
    )
    setNights(newNights)
    setBedType(get(userWishes, 'bedType', []))
    setBackProblems(get(userWishes, 'backProblems', false))
    set(canHostCountRef, 'current.value', `${get(userWishes, 'canHostCount', 0)}`)
    set(cohostVolunteerRef, 'current.value', get(userWishes, 'cohostVolunteer', ''))
    set(petAllergiesRef, 'current.value', get(userWishes, 'petAllergies', ''))
    set(bedConfigurationRef, 'current.value', get(userWishes, 'bedConfiguration', ''))
    set(hostAddressRef, 'current.value', get(userWishes, 'hostAddress', ''))
    set(transportTypeRef, 'current.value', get(userWishes, 'transportType', ''))
    setFestivalProximity(get(userWishes, 'festivalProximity', ''))
    set(distanceToFestivalRef, 'current.value', get(userWishes, 'distanceToFestival', ''))
    set(hostingNeedReasonRef, 'current.value', get(userWishes, 'hostingNeedReason', ''))
    setHostingAbsoluteNeed(get(userWishes, 'hostingAbsoluteNeed', false))
  }, [userWishes])

  const onHostingTypeChange = useCallback((newHostingType: string) => {
    setHostingType(newHostingType)
  }, [])

  const onBackProblemsChange = useCallback((newBackProblems: boolean) => {
    setBackProblems(newBackProblems)
  }, [])

  const onNightClick = useCallback(
    (changes: NightChoices) => {
      setNights({
        ...nights,
        ...changes,
      })
    },
    [nights, setNights],
  )

  function isNightUnselected(abbr: string): boolean {
    return !nights[abbr] && !nights[abbr.toLowerCase()]
  }
  function isNightSelected(abbr: string): boolean {
    return nights[abbr]
  }

  const onBedTypeChange = useCallback(
    (bed: string) => {
      if (includes(bedType, bed)) {
        setBedType(without(bedType, bed))
      }
      else {
        setBedType([...bedType, bed])
      }
    },
    [bedType],
  )

  const onIsolatedBedChange = useCallback((newIsolatedBed: boolean) => {
    setIsolatedBed(newIsolatedBed)
  }, [])

  const onHostingAbsoluteNeedChange = useCallback((newHostingAbsoluteNeed: boolean) => {
    setHostingAbsoluteNeed(newHostingAbsoluteNeed)
  }, [])

  const onFestivalProximityChange = useCallback((newFestivalProximity: string) => {
    setFestivalProximity(newFestivalProximity)
  }, [])

  const onChoiceSubmit = useCallback(() => {
    const canHostCount = +get(canHostCountRef, 'current.value', '0')
    const cohostVolunteer = get(cohostVolunteerRef, 'current.value', '')
    const bedConfiguration = get(bedConfigurationRef, 'current.value', '')
    const hostingNights = nightList.reduce((res, { abbr }) => {
      if (nights[abbr]) {
        res += abbr
      }
      if (nights[abbr.toLowerCase()]) {
        res += abbr.toLowerCase()
      }
      return res
    }, '')
    const hostAddress = get(hostAddressRef, 'current.value', '')
    const petAllergies = get(petAllergiesRef, 'current.value', '')
    const transportType = get(transportTypeRef, 'current.value', '')
    const distanceToFestival = get(distanceToFestivalRef, 'current.value', '')
    const hostingNeedReason = get(hostingNeedReasonRef, 'current.value', '')
    saveWishes(
      hostingType,
      canHostCount,
      cohostVolunteer,
      backProblems,
      hostingNights,
      bedType,
      isolatedBed,
      bedConfiguration,
      hostAddress,
      petAllergies,
      transportType,
      festivalProximity,
      distanceToFestival,
      hostingNeedReason,
      hostingAbsoluteNeed,
    )
    if (afterSubmit)
      afterSubmit()
  }, [
    saveWishes,
    hostingType,
    backProblems,
    bedType,
    isolatedBed,
    festivalProximity,
    hostingAbsoluteNeed,
    afterSubmit,
    nights,
  ])

  const getNightElement = (option: NightOption, maybeText: string): JSX.Element => (
    <div className={classnames(styles.inputWrapper, styles.noBottomMargin)} key={option.abbr}>
      <div className={styles.leftCol}>
        <div className={styles.nightTitle}>{option.title}</div>
      </div>
      <div className={styles.rightCol}>
        <label className={styles.nightLabel} key={`no${option.abbr}`}>
          <input
            type="radio"
            name={`no${option.abbr}`}
            onChange={() =>
              onNightClick({
                [option.abbr]: false,
                [option.abbr.toLowerCase()]: false,
              })}
            checked={isNightUnselected(option.abbr)}
          />
          {' '}
          Non
        </label>
        <label className={styles.nightLabelLong} key={option.abbr.toLowerCase()}>
          <input
            type="radio"
            name={option.abbr.toLowerCase()}
            onChange={() =>
              onNightClick({
                [option.abbr]: false,
                [option.abbr.toLowerCase()]: true,
              })}
            checked={isNightSelected(option.abbr.toLowerCase())}
          />
          {maybeText}
        </label>
        <label className={styles.nightLabel} key={option.abbr}>
          <input
            type="radio"
            name={option.abbr}
            onChange={() =>
              onNightClick({
                [option.abbr]: true,
                [option.abbr.toLowerCase()]: false,
              })}
            checked={isNightSelected(option.abbr)}
          />
          {' '}
          Oui
        </label>
      </div>
    </div>
  )

  return (
    <div>
      <div className={styles.title}>Mon hébergement</div>

      <div
        className={classnames(
          styles.inputWrapper,
          styles.noBottomMargin,
          styles.hostingTypeForm,
        )}
      >
        <div className={styles.rightCol}>
          <label className={styles.hostingTypeLabel}>
            <input
              type="radio"
              name="propose"
              onChange={() => onHostingTypeChange('propose')}
              checked={hostingType === 'propose'}
            />
            {' '}
            Je peux héberger au moins un bénévole
          </label>
          <label className={styles.hostingTypeLabel}>
            <input
              type="radio"
              name="cherche"
              onChange={() => onHostingTypeChange('cherche')}
              checked={hostingType === 'cherche'}
            />
            {' '}
            J'aurais besoin d'un hébergement de la part d'un bénévole proche du festival
          </label>
          <label className={styles.hostingTypeLabel}>
            <input
              type="radio"
              name="neither"
              onChange={() => onHostingTypeChange('')}
              checked={hostingType === ''}
            />
            {' '}
            Aucun des deux
          </label>
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.canHostCountTitle}>
            Combien de bénévoles peux-tu héberger ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <input className={styles.canHostCountLabel} type="text" ref={canHostCountRef} />
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.petAllergiesTitle}>
            As-tu un animal de compagnie ? (Possibles allergies ou phobies) ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <input className={styles.petAllergiesLabel} type="text" ref={petAllergiesRef} />
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.noBottomMargin,
          hostingType !== 'cherche' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.backProblemsTitle}>As-tu des problèmes de dos ?</div>
        </div>
        <div className={styles.rightCol}>
          <label className={styles.backProblemsLabel}>
            <input
              type="radio"
              name="backProblems"
              onChange={() => onBackProblemsChange(true)}
              checked={backProblems}
            />
            {' '}
            Oui
          </label>
          <label className={styles.backProblemsLabel}>
            <input
              type="radio"
              name="backProblems"
              onChange={() => onBackProblemsChange(false)}
              checked={!backProblems}
            />
            {' '}
            Non
          </label>
        </div>
      </div>

      <div
        className={classnames([
          hostingType === '' || hostingType === 'neither' ? styles.hide : null,
        ])}
      >
        {nightList.map(nightOption =>
          getNightElement(
            nightOption,
            hostingType === 'cherche'
              ? ' J\'aimerai bien mais pas obligatoire'
              : ' Je peux mais ça ne m\'arrange pas trop',
          ),
        )}
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.noBottomMargin,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.bedTypeTitle}>Le couchage que tu proposes est-il :</div>
        </div>
        <div className={styles.rightCol}>
          {bedList.map(bed => (
            <label className={styles.bedTypeLabel} key={bed}>
              <input
                type="checkbox"
                value="oui"
                name={bed}
                onChange={() => onBedTypeChange(bed)}
                checked={includes(bedType, bed)}
              />
              {' '}
              {bed}
            </label>
          ))}
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.noBottomMargin,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.isolatedBedTitle}>
            Le couchage est-il dans une pièce séparée ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <label className={styles.isolatedBedLabel}>
            <input
              type="radio"
              name="isolatedBed"
              onChange={() => onIsolatedBedChange(true)}
              checked={isolatedBed}
            />
            {' '}
            Oui
          </label>
          <label className={styles.isolatedBedLabel}>
            <input
              type="radio"
              name="isolatedBed"
              onChange={() => onIsolatedBedChange(false)}
              checked={!isolatedBed}
            />
            {' '}
            Non
          </label>
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.bedConfigurationWrapper,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.bedConfigurationTitle}>
            Si tu peux héberger plusieurs bénévoles, quelle est la configuration des
            couchages proposés ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <textarea id="bedConfiguration-comment" ref={bedConfigurationRef} />
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.hostAddressWrapper,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.hostAddressTitle}>
            Où habites-tu ? Au minium, quelle ville ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <textarea id="hostAddress" ref={hostAddressRef} />
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.noBottomMargin,
          hostingType !== 'cherche' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.festivalProximityTitle}>Où habites-tu ?</div>
        </div>
        <div className={styles.rightCol}>
          {hostLocations.map(hostLocation => (
            <label className={styles.festivalProximityLabel} key={hostLocation}>
              <input
                type="radio"
                name="festivalProximity"
                onChange={() => onFestivalProximityChange(hostLocation)}
                checked={hostLocation === festivalProximity}
              />
              {' '}
              {hostLocation}
            </label>
          ))}
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          hostingType !== 'propose' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.transportTypeTitle}>
            Par quel moyen de transport prévois-tu de venir avec le/les bénévole(s) ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <input
            className={styles.transportTypeLabel}
            type="text"
            ref={transportTypeRef}
          />
        </div>
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          (hostingType === ''
                        || hostingType === 'neither'
                        || (hostingType === 'cherche'
                            && (festivalProximity === 'hors région parisienne'
                                || festivalProximity === '')))
                        && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.distanceToFestivalTitle}>
            A combien de temps habites-tu de la pelouse de Reuilly porte à porte ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <input
            className={styles.distanceToFestivalLabel}
            type="text"
            ref={distanceToFestivalRef}
          />
        </div>
      </div>

      <div
        className={classnames([
          styles.hostingNeedReasonWrapper,
          (hostingType !== 'cherche'
                        || festivalProximity === 'hors région parisienne'
                        || festivalProximity === '')
                        && styles.hide,
        ])}
      >
        <label htmlFor="hostingNeedReason">Pourquoi as-tu besoin d'un hébergement ?</label>
        <textarea id="hostingNeedReason" ref={hostingNeedReasonRef} />
      </div>

      <div
        className={classnames([
          styles.inputWrapper,
          styles.noBottomMargin,
          hostingType !== 'cherche' && styles.hide,
        ])}
      >
        <div className={styles.leftCol}>
          <div className={styles.hostingAbsoluteNeedTitle}>
            Pourras-tu venir au festival même si on ne te trouve pas d’hébergement
            bénévole ?
          </div>
        </div>
        <div className={styles.rightCol}>
          <label className={styles.hostingAbsoluteNeedLabel}>
            <input
              type="radio"
              name="hostingAbsoluteNeed"
              onChange={() => onHostingAbsoluteNeedChange(true)}
              checked={hostingAbsoluteNeed}
            />
            {' '}
            Oui
          </label>
          <label className={styles.hostingAbsoluteNeedLabel}>
            <input
              type="radio"
              name="hostingAbsoluteNeed"
              onChange={() => onHostingAbsoluteNeedChange(false)}
              checked={!hostingAbsoluteNeed}
            />
            {' '}
            Non
          </label>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <FormButton onClick={onChoiceSubmit}>Enregistrer</FormButton>
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

HostingForm.defaultProps = {
  children: undefined,
  afterSubmit: undefined,
}

export default memo(HostingForm)

export const fetchForHostingForm = [fetchVolunteerHostingSetIfNeed]
