import { buildSseSubscriptions } from '../utils'

describe('realtime utils', () => {
  describe('buildSseSubscriptions', () => {
    it('should create sorted chunks for both supported event types', () => {
      const subscriptions = buildSseSubscriptions({
        factionIds: ['b', 'a', 'c', 'a'],
        chunkSize: 2,
      })

      expect(subscriptions).toEqual([
        { eventType: 'factionStateChanged', factionIds: ['a', 'b'] },
        { eventType: 'factionStateChanged', factionIds: ['c'] },
        { eventType: 'factionControlThreatChanged', factionIds: ['a', 'b'] },
        { eventType: 'factionControlThreatChanged', factionIds: ['c'] },
      ])
    })
  })
})
