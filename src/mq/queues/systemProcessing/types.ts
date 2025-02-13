import type { FactionState } from '@prisma/client'
import type { EDDNFactionState } from '../../../types/eddn'

export type StateChanges = {
  statesToEnd: FactionState[]
  activeStatesToStart: EDDNFactionState[]
  pendingStatesToStart: EDDNFactionState[]
  recoveringStatesToStart: EDDNFactionState[]
}
