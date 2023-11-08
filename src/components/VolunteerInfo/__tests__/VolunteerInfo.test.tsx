import { describe, expect, it } from 'vitest'
import VolunteerInfo from '../VolunteerInfo'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { volunteerExample } from '@/services/volunteers'

describe('<VolunteerInfo />', () => {
  it('renders', () => {
    const tree = render(
      <MemoryRouter>
        <VolunteerInfo item={volunteerExample} />
      </MemoryRouter>,
    ).container.firstChild

    expect(tree).toMatchSnapshot()
  })
})
