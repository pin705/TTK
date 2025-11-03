export function useGameAction() {
  const { addMultipleLogs, addLog } = useGameLog()
  const playerStore = usePlayerStore()
  const mapStore = useMapStore()
  const isLoading = ref(false)

  async function execute<T>(action: string, payload?: T) {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const result = await $fetch('/api/action', {
        method: 'POST',
        body: { action, payload }
      })

      // Xử lý log trả về từ action
      if (result.log) {
        // 1. Normalize `result.log` into an array, regardless of its original form.
        const logsToProcess = Array.isArray(result.log) ? result.log : [result.log]

        // 2. Map the normalized array to the client-side LogEntry format.
        const newLogs: LogEntry[] = logsToProcess.map((l: any) => ({
          timestamp: new Date().toISOString(),
          message: l.message,
          type: l.type
        }))

        // 3. Add the new logs to the UI.
        if (newLogs.length > 0) {
          addMultipleLogs(newLogs)
        }
      }

      // Xử lý updates state
      if (result.updates) {
        if (result.updates.character)
          playerStore.updateCharacter(result.updates.character)
        if (result.updates.zone) {
          // If zone has zoneId property, it's a complete zone replacement (e.g., after defeat/respawn)
          if (result.updates.zone.zoneId) {
            mapStore.setCurrentZone(result.updates.zone)
          } else {
            // Otherwise, just update partial zone data (e.g., monster list)
            mapStore.uploadCurrentZone(result.updates.zone)
          }
        }
      }
    } catch (error: any) {
      const message = error.data?.message || 'Có lỗi xảy ra'
      addLog(message, 'error')
    } finally {
      isLoading.value = false
    }
  }

  return { execute, isLoading }
}
