import type { FC } from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import ContentTitle from '../ui/Content/ContentTitle'
import styles from './styles.module.scss'
import { selectVolunteerListAlphaSorted } from '@/store/volunteerList'
import { selectTeamList } from '@/store/teamList'

const selectVolunteersWithTeamWishes = createSelector(
  selectVolunteerListAlphaSorted,
  selectTeamList,
  (volunteers, teams) => volunteers
    .filter(volunteer => volunteer.teamWishes.length > 0)
    .map(volunteer => ({
      ...volunteer,
      teamWishes: volunteer.teamWishes
        .filter(wishId => wishId !== volunteer.team)
        .map((wishId) => {
          const matchingTeam = teams.find((team: any) => wishId === team?.id)
          return matchingTeam?.name
        }),
      teamObject: teams.find((team: any) => volunteer.team === team?.id),
    })),
)

const selectVolunteersWithTeam = createSelector(selectVolunteersWithTeamWishes, volunteers =>
  volunteers.filter(volunteer => volunteer.teamObject))

const selectVolunteersWithoutTeam = createSelector(selectVolunteersWithTeamWishes, volunteers =>
  volunteers.filter(volunteer => !volunteer.teamObject))

const VolunteersWithTeamWishes: FC = (): JSX.Element => {
  const volunteersWithTeam = useSelector(selectVolunteersWithTeam)
  const volunteersWithoutTeam = useSelector(selectVolunteersWithoutTeam)

  return (
    <>
      <ContentTitle title="Choix des bénévoles" />
      <div>
        <div>
          Bénévoles en attente d'équipe (
          {volunteersWithoutTeam.length}
          ) :
        </div>
        <ul>
          {volunteersWithoutTeam.map(
            ({ id, lastname, firstname, teamWishes, teamObject }) => (
              <li key={id}>
                <span className={styles.volunteerName}>
                  {firstname}
                  {' '}
                  {lastname}
                  {' '}
                </span>
                <span className={styles.teamActive}>
                  {teamObject?.name}
                  {' '}
                </span>
                <span>{teamWishes.join(', ')}</span>
              </li>
            ),
          )}
        </ul>
        <div>
          Bénévoles dans une équipe (
          {volunteersWithTeam.length}
          ) :
        </div>
        <ul>
          {volunteersWithTeam.map(
            ({ id, lastname, firstname, teamWishes, teamObject }) => (
              <li key={id}>
                <span className={styles.volunteerName}>
                  {firstname}
                  {' '}
                  {lastname}
                  {' '}
                </span>
                <span className={styles.teamActive}>
                  {teamObject?.name}
                  {' '}
                </span>
                <span>{teamWishes.join(', ')}</span>
              </li>
            ),
          )}
        </ul>
      </div>
    </>
  )
}

export default memo(VolunteersWithTeamWishes)
