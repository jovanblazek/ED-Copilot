import {
  getTrackedFactionsInSystem,
  getAllStatesToEnd,
  getAllStatesToStart,
  isConflictInEDDNStateArray,
  getConflictByFactionName,
  transformConflictToDiscordNotificationData,
  groupFactionStatesByType,
} from '../utils'
import { EDDNState, EDDNConflictStatus, EDDNWarType } from '../../../../types/eddn'
import { StateType } from '@prisma/client'
import * as redis from '../../../../utils/redis'

// Mock redis module
jest.mock('../../../../utils/redis', () => ({
  getTrackedFactions: jest.fn(),
}))

describe('systemProcessing utils', () => {
  describe('getTrackedFactionsInSystem', () => {
    it('should filter tracked factions that exist in event factions', async () => {
      const eventFactions = [{ Name: 'Faction1' }, { Name: 'Faction2' }, { Name: 'Faction3' }]
      const trackedFactions = [
        { id: 1, name: 'Faction1' },
        { id: 2, name: 'Faction4' },
      ]

      jest.spyOn(redis, 'getTrackedFactions').mockResolvedValue(trackedFactions)

      // @ts-expect-error Not fully typed
      const result = await getTrackedFactionsInSystem(eventFactions)
      expect(result).toEqual([{ id: 1, name: 'Faction1' }])
    })
  })

  describe('getAllStatesToEnd', () => {
    it('should return states that are no longer present in the event', () => {
      const currentDbStatesByType = {
        [StateType.Active]: [
          { id: 1, stateName: EDDNState.War },
          { id: 2, stateName: EDDNState.Boom },
        ],
        [StateType.Pending]: [{ id: 3, stateName: EDDNState.Expansion }],
        [StateType.Recovering]: [{ id: 4, stateName: EDDNState.Drought }],
      }

      const factionFromEvent = {
        ActiveStates: [{ State: EDDNState.Boom }],
        PendingStates: [],
        RecoveringStates: [],
      }

      const result = getAllStatesToEnd({
        // @ts-expect-error Not fully typed
        currentDbStatesByType,
        // @ts-expect-error Not fully typed
        factionFromEvent,
      })

      expect(result).toEqual([
        { id: 1, stateName: EDDNState.War },
        { id: 3, stateName: EDDNState.Expansion },
        { id: 4, stateName: EDDNState.Drought },
      ])
    })
  })

  describe('getAllStatesToStart', () => {
    it('should return new states from the event that are not in the database', () => {
      const currentDbStatesByType = {
        [StateType.Active]: [{ stateName: EDDNState.Boom }],
        [StateType.Pending]: [],
        [StateType.Recovering]: [],
      }

      const factionFromEvent = {
        ActiveStates: [{ State: EDDNState.Boom }, { State: EDDNState.War }],
        PendingStates: [{ State: EDDNState.Election }],
        RecoveringStates: [{ State: EDDNState.Drought }],
      }

      const result = getAllStatesToStart({
        // @ts-expect-error Not fully typed
        currentDbStatesByType,
        // @ts-expect-error Not fully typed
        factionFromEvent,
      })

      expect(result).toEqual({
        activeStatesToStart: [{ State: EDDNState.War }],
        pendingStatesToStart: [{ State: EDDNState.Election }],
        recoveringStatesToStart: [{ State: EDDNState.Drought }],
      })
    })
  })

  describe('isConflictInEDDNStateArray', () => {
    it('should return true if conflict state exists', () => {
      const states = [
        { State: EDDNState.Boom, Trend: 0 },
        { State: EDDNState.War, Trend: 0 },
        { State: EDDNState.Drought, Trend: 0 },
      ]
      expect(isConflictInEDDNStateArray(states)).toBe(true)
    })

    it('should return false if no conflict state exists', () => {
      const states = [
        { State: EDDNState.Boom, Trend: 0 },
        { State: EDDNState.Drought, Trend: 0 },
      ]
      expect(isConflictInEDDNStateArray(states)).toBe(false)
    })
  })

  describe('getConflictByFactionName', () => {
    it('should find conflict where faction is Faction1', () => {
      const conflicts = [
        {
          Faction1: { Name: 'TestFaction' },
          Faction2: { Name: 'OtherFaction' },
        },
      ]
      // @ts-expect-error Not fully typed
      expect(getConflictByFactionName(conflicts, 'TestFaction')).toEqual(conflicts[0])
    })

    it('should find conflict where faction is Faction2', () => {
      const conflicts = [
        {
          Faction1: { Name: 'OtherFaction' },
          Faction2: { Name: 'TestFaction' },
        },
      ]
      // @ts-expect-error Not fully typed
      expect(getConflictByFactionName(conflicts, 'TestFaction')).toEqual(conflicts[0])
    })

    it('should return undefined if faction is not in any conflict', () => {
      const conflicts = [
        {
          Faction1: { Name: 'Faction1' },
          Faction2: { Name: 'Faction2' },
        },
      ]
      // @ts-expect-error Not fully typed
      expect(getConflictByFactionName(conflicts, 'TestFaction')).toBeUndefined()
    })
  })

  describe('transformConflictToDiscordNotificationData', () => {
    it('should transform EDDN conflict data to Discord notification format', () => {
      const eddnConflict = {
        Faction1: {
          Name: 'Faction1',
          Stake: 'High Stakes',
          WonDays: 2,
        },
        Faction2: {
          Name: 'Faction2',
          Stake: 'Low Stakes',
          WonDays: 1,
        },
        Status: EDDNConflictStatus.Active,
        WarType: EDDNWarType.War,
      }

      const expected = {
        faction1: {
          name: 'Faction1',
          stake: 'High Stakes',
          wonDays: 2,
        },
        faction2: {
          name: 'Faction2',
          stake: 'Low Stakes',
          wonDays: 1,
        },
        status: EDDNConflictStatus.Active,
        conflictType: EDDNWarType.War,
      }

      expect(transformConflictToDiscordNotificationData(eddnConflict)).toEqual(expected)
    })
  })

  describe('groupFactionStatesByType', () => {
    it('should group faction states by type', () => {
      const factionStates = [
        { id: 1, stateName: EDDNState.Boom, stateType: StateType.Active },
        { id: 2, stateName: EDDNState.Election, stateType: StateType.Pending },
        { id: 3, stateName: EDDNState.Drought, stateType: StateType.Recovering },
        { id: 4, stateName: EDDNState.War, stateType: StateType.Active },
        { id: 5, stateName: EDDNState.Bust, stateType: StateType.Pending },
        { id: 6, stateName: EDDNState.CivilLiberty, stateType: StateType.Recovering },
      ]

      // @ts-expect-error Not fully typed
      const result = groupFactionStatesByType(factionStates)
      expect(result).toEqual({
        [StateType.Active]: [
          { id: 1, stateName: EDDNState.Boom, stateType: StateType.Active },
          { id: 4, stateName: EDDNState.War, stateType: StateType.Active },
        ],
        [StateType.Pending]: [
          { id: 2, stateName: EDDNState.Election, stateType: StateType.Pending },
          { id: 5, stateName: EDDNState.Bust, stateType: StateType.Pending },
        ],
        [StateType.Recovering]: [
          { id: 3, stateName: EDDNState.Drought, stateType: StateType.Recovering },
          { id: 6, stateName: EDDNState.CivilLiberty, stateType: StateType.Recovering },
        ],
      })
    })
  })
})
