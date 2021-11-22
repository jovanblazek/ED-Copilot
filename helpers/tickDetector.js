const { io } = require('socket.io-client')
const moment = require('moment')
// eslint-disable-next-line no-unused-vars
const momenttz = require('moment-timezone')
const { setTickTime } = require('../data/Tick')

exports.tickDetector = (client) => {
	const _client = client
	const socket = io('http://tick.phelbore.com:31173')

	socket.on('connect', () => {
		console.log('Connected to Tick Detector')
	})

	socket.on('tick', (data) => {
		console.log('Tick detected', moment.utc(data))
		setTickTime(moment.utc(data))
		_client.commands.get('tick').execute(null, [], _client)
		_client.commands.get('itrc').systems(null, _client)
	})
}
