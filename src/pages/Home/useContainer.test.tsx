import { renderHook, act } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import useContainer from './useContainer'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <RecoilRoot>{children}</RecoilRoot>
  </MemoryRouter>
)

describe('useContainer', () => {
  it('opening a modal closes the others', () => {
    const { result } = renderHook(() => useContainer(), { wrapper })

    act(() => result.current.modalStateHandler('colorPicker'))
    expect(result.current.modalOpenState.colorPicker).toBe(true)

    act(() => result.current.modalStateHandler('createLobby'))
    expect(result.current.modalOpenState.colorPicker).toBe(false)
    expect(result.current.modalOpenState.createLobby).toBe(true)
  })

  it('handleColorClick updates the selected body part color', () => {
    const { result } = renderHook(() => useContainer(), { wrapper })

    act(() => result.current.handleColorClick('#ff006e', 'Body'))
    expect(result.current.bodyPartColor.Body).toBe('#ff006e')
    expect(result.current.selectedPart).toBe('Body')
  })

  it('modalClose closes every modal', () => {
    const { result } = renderHook(() => useContainer(), { wrapper })

    act(() => result.current.modalStateHandler('help'))
    act(() => result.current.modalClose())

    Object.values(result.current.modalOpenState).forEach((open) =>
      expect(open).toBe(false),
    )
  })
})
