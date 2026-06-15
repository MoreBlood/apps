export type InstallPhase = 'init' | 'ready' | 'installing' | 'complete'

export function isInstallLogStreaming(phase: InstallPhase, visibleLogs: number, totalLogs: number): boolean {
	if (phase === 'init') return visibleLogs < totalLogs
	if (phase === 'installing') return visibleLogs < totalLogs
	return false
}
