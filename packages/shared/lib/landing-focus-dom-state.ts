const presentTokens = new Set<symbol>()
const openTokens = new Set<symbol>()

function applyPresentClass() {
	if (typeof document === 'undefined') return
	document.documentElement.classList.toggle('landing-stage-focus-present', presentTokens.size > 0)
}

function applyOpenClass() {
	if (typeof document === 'undefined') return
	const open = openTokens.size > 0
	document.documentElement.classList.toggle('landing-stage-focus-open', open)
	document.body.classList.toggle('landing-stage-focus-open', open)
}

export function setLandingFocusPresent(token: symbol, active: boolean) {
	if (active) {
		presentTokens.add(token)
	} else {
		presentTokens.delete(token)
	}
	applyPresentClass()
	return presentTokens.size > 0
}

export function clearLandingFocusPresent(token: symbol) {
	presentTokens.delete(token)
	applyPresentClass()
	return presentTokens.size > 0
}

export function setLandingFocusOpen(token: symbol, active: boolean) {
	if (active) {
		openTokens.add(token)
	} else {
		openTokens.delete(token)
	}
	applyOpenClass()
	return openTokens.size > 0
}

export function clearLandingFocusOpen(token: symbol) {
	openTokens.delete(token)
	applyOpenClass()
	return openTokens.size > 0
}
