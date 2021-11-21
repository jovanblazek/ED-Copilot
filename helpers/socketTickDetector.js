const { io } = require('socket.io-client')
const fs = require('fs')

exports.tickDetector = () => {
	const socket = io('http://tick.phelbore.com:31173')

	socket.on('connect', () => {
		console.log('Connected to Tick Detector')
	})

	socket.on('tick', (data) => {
		console.log('Tick detected', new Date())
		console.log(data, new Date(data))
		fs.writeFile('./log', data, (err) => {
			if (err) {
				console.log(err)
			} else {
				console.log('The file was saved!')
			}
		})
	})
}
