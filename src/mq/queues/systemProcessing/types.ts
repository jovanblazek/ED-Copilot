import { FactionState } from '@prisma/client'
import { EDDNFactionState } from '../../../types/eddn'

export type StateChanges = {
  statesToEnd: FactionState[]
  activeStatesToStart: EDDNFactionState[]
  pendingStatesToStart: EDDNFactionState[]
  recoveringStatesToStart: EDDNFactionState[]
}
