import dayjs from 'dayjs'
import { isConflictState, isSystemInConflict } from '../systems'

describe('faction systems helpers', () => {
  it('marks only war, civil war, and election as conflict states', () => {
    expect(isConflictState('War')).toBe(true)
    expect(isConflictState('CivilWar')).toBe(true)
    expect(isConflictState('Election')).toBe(true)
    expect(isConflictState('Boom')).toBe(false)
    expect(isConflictState(null)).toBe(false)
  })

  it('detects conflict from active or pending states', () => {
    expect(isSystemInConflict({ activeStates: ['Boom', 'War'], pendingStates: [] })).toBe(true)
    expect(isSystemInConflict({ activeStates: [], pendingStates: ['Election'] })).toBe(true)
    expect(isSystemInConflict({ activeStates: ['Boom'], pendingStates: ['Expansion'] })).toBe(false)
  })

  it('keeps timestamp parsing aligned with systems command usage', () => {
    expect(dayjs('2026-04-06T12:00:00.000Z').utc().toISOString()).toBe('2026-04-06T12:00:00.000Z')
  })
})
