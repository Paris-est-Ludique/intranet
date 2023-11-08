import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WishAdd from '../WishAdd'

describe('<WishAdd />', () => {
  it('renders', () => {
    const dispatch = vi.fn()
    const tree = render(
      <MemoryRouter>
        <WishAdd dispatch={dispatch} />
      </MemoryRouter>,
    ).container.firstChild

    expect(tree).toMatchSnapshot()
  })
})
