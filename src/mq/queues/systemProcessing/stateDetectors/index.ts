import { ConflictDetector } from './ConflictDetector'
import { ExpansionDetector } from './ExpansionDetector'
import { InfluenceThreatDetector } from './InfluenceThreatDetector'
import { RetreatDetector } from './RetreatDetector'
import type { StateDetector } from './types'

export const StateDetectors: StateDetector[] = [
  new ConflictDetector(),
  new ExpansionDetector(),
  new RetreatDetector(),
  new InfluenceThreatDetector(),
]

export * from './types'
