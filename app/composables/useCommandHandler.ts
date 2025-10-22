import { zones, npcs } from '~~/shared/config'

export function useCommandHandler() {
  const playerStore = usePlayerStore()
  const mapStore = useMapStore()
  const { addLog } = useGameLog()

  /**
   * Phân tích và thực thi một lệnh từ người dùng.
   * @param commandString Lệnh đầy đủ, ví dụ: "/status" hoặc "/goto giang_nam_vo_quan_01"
   */
  function executeCommand(commandString: string) {
    if (!commandString.startsWith('/')) {
      // Xử lý như chat thông thường hoặc thông báo lỗi
      addLog(`Lệnh không hợp lệ: "${commandString}". Lệnh phải bắt đầu bằng '/'.`, 'error')
      return
    }

    const [cmd, ...args] = commandString.substring(1).split(' ')
    const command = cmd.toLowerCase()

    addLog(`> ${commandString}`, 'command') // Hiển thị lại lệnh người dùng đã gõ

    switch (command) {
      case 'status':
      case 'st':
        showStatus()
        break
      case 'map':
        showAsciiMap()
        break
      case 'events':
        showEvents()
        break
      case 'npc':
        showNpcs()
        break
      default:
        addLog(`Lệnh không tồn tại: /${command}`, 'error')
    }
  }

  // --- Các hàm xử lý cho từng lệnh ---

  function showAsciiMap() {
    const zoneId = mapStore.currentZone?.zoneId as keyof typeof zones
    if (!zoneId) return
    const currentZone = zones[zoneId]
    addLog('--- [ BẢN ĐỒ KHU VỰC ] ---', 'info')
    currentZone.connectedZones?.forEach((exit) => {
      const exitZone = zones[exit.zoneId as keyof typeof zones]
      addLog(`[Bạn] <==(${exit.direction})==> [${exitZone.name}]`, 'info')
    })
    if (!currentZone.connectedZones?.length) addLog('Không có lối đi nào.', 'info')
  }

  function showNpcs() {
    const zoneId = mapStore.currentZone?.zoneId as keyof typeof zones
    console.log('Current Zone ID:', zoneId)
    if (!zoneId) return
    const currentZone = zones[zoneId]
    addLog('--- [ NPC TRONG KHU VỰC ] ---', 'info')
    if (!currentZone.npcs?.length) {
      addLog('Không có NPC nào ở đây.', 'info')
      return
    }
    currentZone.npcs.forEach((entry) => {
      const npcData = npcs[entry.npcId as keyof typeof npcs]
      addLog(`- ${npcData.name}`, 'info')
    })
  }

  function showStatus() {
    const char = playerStore.character
    if (!char) return

    addLog('--- [ TRẠNG THÁI NHÂN VẬT ] ---', 'info')
    addLog(`Tên: ${char.name} | Cảnh giới: ${char.cultivation.stage}`, 'info')
    addLog(`HP: ${char.hp}/${char.hpMax} | Năng Lượng: ${char.energy}/${char.energyMax}`, 'info')
    addLog(`Tấn Công: ${char.stats.attack} | Phòng Thủ: ${char.stats.defense}`, 'info')
    addLog(`Tâm Cảnh: ${char.cultivation.stateOfMind.toFixed(1)} | Ngộ Đạo: ${char.cultivation.comprehension}`, 'info')
  }

  function showMap() {
    const zone = mapStore.currentZone
    if (!zone) return

    addLog(`--- [ BẢN ĐỒ KHU VỰC ] ---`, 'info')
    addLog(`Bạn đang ở: ${zone.name}`, 'info')
    addLog('Các lối đi có thể:', 'info')
    if (zone.connectedZones.length === 0) {
      addLog('- Không có lối đi nào.', 'info')
    } else {
      zone.connectedZones.forEach((exit) => {
        addLog(`- ${exit.direction}`, 'info')
      })
    }
  }

  function showEvents() {
    const zone = mapStore.currentZone
    if (!zone) return

    addLog(`--- [ SỰ KIỆN KHU VỰC ] ---`, 'info')
    if (zone.weatherEffect && zone.weatherEffect !== 'none') {
      addLog(`Thời tiết: ${zone.weatherEffect}`, 'info')
    } else {
      addLog('Khu vực hiện tại không có sự kiện đặc biệt.', 'info')
    }
  }

  return {
    executeCommand
  }
}
