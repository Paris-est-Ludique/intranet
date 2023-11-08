import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import VolunteerList from '../VolunteerList'

import { volunteerExample } from '@/services/volunteers'

describe('<VolunteerList />', () => {
  it('renders', () => {
    const tree = render(
      <MemoryRouter>
        <VolunteerList items={[volunteerExample]} />
      </MemoryRouter>,
    ).container.firstChild

    expect(tree).toMatchSnapshot()
  })
})
