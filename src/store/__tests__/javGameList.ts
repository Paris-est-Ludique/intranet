import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'

import { fetchGameList, gameListActions, gameListInitialState } from '../gameList'
import mockStore from '@/utils/mockStore'
import type { Game } from '@/services/games'

vi.mock('axios')

const mockData: Game[] = [
  {
    id: 5,
    title: '6 qui prend!',
    bggId: 432,
    bggIdAlternative: '',
    bggTitle: '6 nimmt!',
    playersMin: 2,
    playersMax: 10,
    duration: 45,
    type: 'Ambiance',
    poufpaf: '0-9-2/6-qui-prend-6-nimmt',
    bggPhoto: 'https://cf.geekdo-images.com/thumb/img/lzczxR5cw7an7tRWeHdOrRtLyes=/fit-in/200x150/pic772547.jpg',
    ean: '3421272101313',
    toBeKnown: false,
  },
]
const mockError = 'Oops! Something went wrong.'

describe('gameList reducer', () => {
  it('should handle initial state', () => {
    expect(gameListReducer(undefined, {})).toEqual(gameListInitialState)
  })

  it('should handle requesting correctly', () => {
    expect(GameList(undefined, { type: gameListActions.getRequesting.type })).toEqual({
      readyStatus: 'request',
      ids: [],
      entities: {},
    })
  })

  it('should handle success correctly', () => {
    expect(
      gameListReducer(undefined, {
        type: gameListActions.getSuccess.type,
        payload: mockData,
      }),
    ).toEqual({
      ...gameListInitialState,
      readyStatus: 'success',
      ids: map(mockData, 'id'),
      entities: keyBy(mockData, 'id'),
    })
  })

  it('should handle failure correctly', () => {
    expect(
      gameListReducer(undefined, {
        type: gameListActions.getFailure.type,
        payload: mockError,
      }),
    ).toEqual({
      ...gameListInitialState,
      readyStatus: 'failure',
      error: mockError,
    })
  })
})

describe('gameList action', () => {
  it('fetches Game list successful', async () => {
    const { dispatch, getActions } = mockStore()
    const expectedActions = [
      { type: gameListActions.getRequesting.type, payload: undefined },
      { type: gameListActions.getSuccess.type, payload: mockData },
    ]

    axios.get.mockResolvedValue({ data: mockData })

    await dispatch(fetchGameList())
    expect(getActions()).toEqual(expectedActions)
  })

  it('fetches Game list failed', async () => {
    const { dispatch, getActions } = mockStore()
    const expectedActions = [
      { type: gameListActions.getRequesting.type },
      { type: gameListActions.getFailure.type, payload: mockError },
    ]

    axios.get.mockRejectedValue({ message: mockError })

    await dispatch(fetchGameList())
    expect(getActions()).toEqual(expectedActions)
  })
})
