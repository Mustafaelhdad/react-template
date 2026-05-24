import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { FileUpload } from './file-upload'

beforeEach(() => {
  // jsdom does not implement these object-URL helpers.
  if (!('createObjectURL' in URL))
    Object.defineProperty(URL, 'createObjectURL', { value: vi.fn(() => 'blob:x') })
  if (!('revokeObjectURL' in URL))
    Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn() })
})

describe('FileUpload', () => {
  it('calls onChange when a file is selected', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    const { container } = render(<FileUpload onChange={handle} />)

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, new File(['hello'], 'note.txt', { type: 'text/plain' }))

    expect(handle).toHaveBeenCalledTimes(1)
    expect(handle.mock.calls[0][0][0].name).toBe('note.txt')
  })

  it('rejects oversize files when maxSizeMb is set', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    const { container } = render(<FileUpload onChange={handle} maxSizeMb={0.000001} />)

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(
      input,
      new File(['this is too big for the configured cap'], 'big.txt', {
        type: 'text/plain',
      }),
    )

    // onChange still fires but the resulting list is empty
    expect(handle).toHaveBeenCalledWith([])
  })

  it('removes a file when the remove button is clicked', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    const file = new File(['hello'], 'note.txt', { type: 'text/plain' })
    render(<FileUpload value={[file]} onChange={handle} />)

    await user.click(screen.getByRole('button', { name: /remove note\.txt/i }))
    expect(handle).toHaveBeenLastCalledWith([])
  })
})
