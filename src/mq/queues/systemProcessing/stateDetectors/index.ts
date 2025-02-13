import { ConflictDetector } from './ConflictDetector'
import { ExpansionDetector } from './ExpansionDetector'
import { RetreatDetector } from './RetreatDetector'
import { StateDetector } from './types'

export const StateDetectors: StateDetector[] = [
  new ConflictDetector(),
  new ExpansionDetector(),
  new RetreatDetector(),
]

export * from './types'
