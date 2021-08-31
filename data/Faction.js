let _id
let _eddbId
let _inaraUrl

exports.setFactionData = (id, eddbId, inaraUrl) => {
	_id = id
	_eddbId = eddbId
	_inaraUrl = inaraUrl
}

exports.getFactionId = () => _id
exports.getFactionEddbId = () => _eddbId
exports.getFactionInaraUrl = () => _inaraUrl
