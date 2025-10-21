export function useGameAction() {
  const { addLog } = useGameLog()
  const playerStore = usePlayerStore()
  const mapStore = useMapStore()
  const isLoading = ref(false)

  // Hàm thực thi hành động chính
  async function execute<T>(action: string, payload?: T) {
    if (isLoading.value)
      return // Ngăn chặn spam click

    isLoading.value = true
    try {
      // Gọi đến API action duy nhất
      const result = await $fetch('/api/action', {
        method: 'POST',
        body: { action, payload },
      })

      // Xử lý kết quả trả về từ server
      if (result.log) {
        if (Array.isArray(result.log))
          result.log.forEach((msg: string) => addLog(msg))
        else
          addLog(result.log)
      }

      // Cập nhật state trên client
      if (result.updates) {
        if (result.updates.character)
          playerStore.updateCharacter(result.updates.character)

        if (result.updates.zone)
          mapStore.setCurrentZone(result.updates.zone)
      }
    }
    catch (error: any) {
      addLog(error.data?.message || 'Có lỗi xảy ra', 'error')
    }
    finally {
      isLoading.value = false
    }
  }

  return { execute, isLoading }
}
