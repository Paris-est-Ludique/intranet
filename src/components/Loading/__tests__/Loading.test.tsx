import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Loading from '../Loading'

describe('<Loading />', () => {
  it('renders', () => {
    const tree = render(
      <MemoryRouter>
        <Loading />
      </MemoryRouter>,
    ).container.firstChild

    expect(tree).toMatchSnapshot()
  })
})
