import faction from './faction'
import interstellarFactors from './interstellarFactors'
import materialTrader from './materialTrader'
import ping from './ping'
import systemDistance from './systemDistance'
import systemInfo from './systemInfo'
import techBroker from './techBroker'
import tick from './tick'

const Commands = [
  ping,
  techBroker,
  materialTrader,
  interstellarFactors,
  systemDistance,
  tick,
  systemInfo,
  faction,
]

export const CommandList = Commands.map((command) => command.command.toJSON())

export const CommandHandlers = Commands.reduce((acc, command) => {
  acc[command.name] = command.handler
  return acc
}, {})
