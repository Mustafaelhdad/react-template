import { fireEvent, render } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useOnClickOutside } from './use-on-click-outside'

function Probe({ onOutside, enabled }: { onOutside: () => void; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onOutside, enabled)
  return (
    <div>
      <div ref={ref} data-testid="inside">
        inside
      </div>
      <button data-testid="outside" type="button">
        outside
      </button>
    </div>
  )
}

describe('useOnClickOutside', () => {
  it('does not fire when clicking inside the ref element', () => {
    const onOutside = vi.fn()
    const { getByTestId } = render(<Probe onOutside={onOutside} />)
    fireEvent.mouseDown(getByTestId('inside'))
    expect(onOutside).not.toHaveBeenCalled()
  })

  it('fires when clicking outside the ref element', () => {
    const onOutside = vi.fn()
    const { getByTestId } = render(<Probe onOutside={onOutside} />)
    fireEvent.mouseDown(getByTestId('outside'))
    expect(onOutside).toHaveBeenCalledTimes(1)
  })

  it('also responds to touch events', () => {
    const onOutside = vi.fn()
    const { getByTestId } = render(<Probe onOutside={onOutside} />)
    fireEvent.touchStart(getByTestId('outside'))
    expect(onOutside).toHaveBeenCalledTimes(1)
  })

  it('respects the enabled flag', () => {
    const onOutside = vi.fn()
    const { getByTestId } = render(<Probe onOutside={onOutside} enabled={false} />)
    fireEvent.mouseDown(getByTestId('outside'))
    expect(onOutside).not.toHaveBeenCalled()
  })
})
