export type HeartbeatMessage = {
  status: string
  timestamp: string
  lastGalaxyTick: string
  version: string
  info: string
}

export type TickMessage = {
  system: string
  systemAddress: number
  schema: string
  timeGapMins: string
  timestamp: string
  dayCount: number
  metrics: {
    tickPass: string
    stateChange: boolean
    infChange: boolean
    infStates: boolean
    cmfInf: number
    cmfHasExpanded: boolean
    cmfInfDrop: string
    cmfExpansionTax: boolean
    conflictEnded: boolean
    factionChanges: {
      retreated: string[]
      arrived: string[]
    }
  }
}
