import interstellarFactors from './interstellarFactors'
import materialTrader from './materialTrader'
import ping from './ping'
import techBroker from './techBroker'

const Commands = [ping, techBroker, materialTrader, interstellarFactors]

export const CommandList = Commands.map((command) => command.command.toJSON())

export const CommandHandlers = Commands.reduce((acc, command) => {
  acc[command.name] = command.handler
  return acc
}, {})
