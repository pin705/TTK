import { zones, npcs } from '~~/shared/config'

const commandList = [
  { command: '/help', alias: '/lenh', description: 'Hiển thị danh sách các lệnh có sẵn.' },
  { command: '/status', alias: '/st', description: 'Hiển thị trạng thái hiện tại của nhân vật.' },
  { command: '/map', description: 'Hiển thị thông tin và các lối đi của khu vực hiện tại.' },
  { command: '/events', description: 'Hiển thị các sự kiện đang diễn ra trong khu vực.' },
  { command: '/npc', description: 'Liệt kê các NPC có mặt trong khu vực.' },
  { command: '/quest accept <quest_id>', description: 'Nhận nhiệm vụ có ID tương ứng từ NPC bạn đang nói chuyện.' },
  { command: '/quest claim <quest_id>', description: 'Trả nhiệm vụ đã hoàn thành (status: completed) cho NPC yêu cầu.' },
  { command: '/quest list', description: 'Xem danh sách nhiệm vụ đang hoạt động (tương tự Tab Nhiệm Vụ).' },
]

export function useCommandHandler() {
  const playerStore = usePlayerStore()
  const mapStore = useMapStore()
  const { addLog } = useGameLog()
  const { execute } = useGameAction() // Lấy hàm execute

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
      case 'help': // ✨ THÊM LỆNH HELP ✨
      case 'lenh':
        showHelp()
        break
      case 'status':
      case 'st':
        showStatus()
        break
      case 'map':
        showAsciiMap()
        break // Đổi tên hàm nếu cần
      case 'events':
        showEvents()
        break
      case 'npc':
        showNpcs()
        break
      case 'quest':
        handleQuestCommand(args)
        break
      default:
        addLog(`Lệnh không tồn tại: /${command}. Gõ /help để xem danh sách lệnh.`, 'error')
    }
  }

  // --- Các hàm xử lý cho từng lệnh ---

  function showHelp() {
    addLog('--- [ DANH SÁCH LỆNH ] ---', 'info')
    commandList.forEach((cmd) => {
      let helpText = `${cmd.command}`
      if (cmd.alias) {
        helpText += ` (hoặc ${cmd.alias})`
      }
      helpText += `: ${cmd.description}`
      addLog(helpText, 'info')
    })
    addLog('-------------------------', 'info')
  }

  async function handleQuestCommand(args: string[]) {
    const subCommand = args[0]?.toLowerCase()
    const questId = args[1]

    if (!subCommand || !questId) {
      addLog('Sử dụng: /quest <accept|claim|list> [quest_id]', 'error')
      return
    }

    switch (subCommand) {
      case 'accept':
        await execute('quest/accept', { questId })
        break
      case 'claim':
        await execute('quest/claim', { questId })
        break
      case 'list':
        // Có thể thêm logic hiển thị chi tiết quest hoặc chỉ cần dùng Tab Quest
        addLog('Xem danh sách nhiệm vụ trong Tab [Nhiệm Vụ].', 'info')
        break
      default:
        addLog(`Lệnh con không hợp lệ: ${subCommand}. Dùng 'accept', 'claim', hoặc 'list'.`, 'error')
    }
  }

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
