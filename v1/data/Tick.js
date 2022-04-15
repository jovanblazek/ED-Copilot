let _tickTime = null

exports.setTickTime = (tickTime) => {
	_tickTime = tickTime
}

exports.getTickTime = () => {
	return _tickTime
}
