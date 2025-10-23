import type { MonsterId, ItemId, NpcId, ZoneId } from './index' // Import các type ID

// Định nghĩa các loại mục tiêu nhiệm vụ
interface QuestObjectiveKill {
  type: 'kill'
  monsterId: MonsterId
  count: number
  description: string // Mô tả hiển thị cho người chơi (VD: "Hạ gục Lợn Rừng Nanh Máu")
}

interface QuestObjectiveGather {
  type: 'gather'
  itemId: ItemId
  count: number
  description: string // VD: "Thu thập Da Thú (Hạ Cấp)"
}

interface QuestObjectiveTalk {
  type: 'talk'
  npcId: NpcId
  description: string // VD: "Nói chuyện với Võ Sư Trương"
}

interface QuestObjectiveExplore {
  type: 'explore'
  zoneId: ZoneId
  description: string // VD: "Khám phá Sào Huyệt Mãnh Hổ"
}

export type QuestObjective = QuestObjectiveKill | QuestObjectiveGather | QuestObjectiveTalk | QuestObjectiveExplore
export type QuestType = 'main' | 'side' | 'daily' | 'co-op' | 'cultivation'

// Định nghĩa cấu trúc phần thưởng
interface QuestRewards {
  exp: number
  items?: { itemId: ItemId, quantity: number }[]
  reputation?: number
  // Thêm các loại phần thưởng khác: tiền, mở khóa zone/skill...
}

// Định nghĩa cấu trúc Quest Template
export interface QuestTemplate {
  title: string
  description: string
  type: 'main' | 'side' | 'daily' | 'co-op' | 'cultivation' // Loại nhiệm vụ
  npcId?: NpcId // NPC giao nhiệm vụ (nếu có)
  requiredLevel?: number // Cấp độ yêu cầu để nhận
  objectives: QuestObjective[]
  rewards: QuestRewards
  isRepeatable?: boolean // Có thể làm lại không (cho daily/weekly)
}

// === DANH SÁCH NHIỆM VỤ ===
export const quests = {
  // Nhiệm vụ đầu tiên
  first_hunt: {
    title: 'Chuyến Đi Săn Đầu Tiên',
    description: 'Võ Sư Trương ở Võ Quán muốn kiểm tra thực lực của võ giả mới. Hãy chứng minh khả năng sinh tồn của bạn ở khu hoang dã.',
    type: 'side',
    npcId: 'vo_su_truong',
    requiredLevel: 1,
    objectives: [
      { type: 'kill', monsterId: 'bloodfang_boar', count: 3, description: 'Hạ gục Lợn Rừng Nanh Máu' },
      { type: 'gather', itemId: 'monster_hide_low', count: 2, description: 'Thu thập Da Thú (Hạ Cấp)' },
      { type: 'talk', npcId: 'vo_su_truong', description: 'Báo cáo lại cho Võ Sư Trương' }
    ],
    rewards: {
      exp: 150,
      items: [{ itemId: 'standard_combat_knife', quantity: 1 }],
      reputation: 10 // Thăng tiến danh tiếng với Võ Quán
    }
  },
  // Nhiệm vụ thu thập vật liệu
  material_request: {
    title: 'Yêu Cầu Vật Liệu',
    description: 'Lão Giả Bán Vật Liệu ở Chợ Giao Dịch đang cần gấp một số Gân Thú để hoàn thành đơn hàng.',
    type: 'side',
    npcId: 'thuong_nhan_vat_lieu',
    requiredLevel: 3,
    objectives: [
      { type: 'gather', itemId: 'monster_tendon_low', count: 5, description: 'Thu thập Gân Thú (Hạ Cấp)' },
      { type: 'talk', npcId: 'thuong_nhan_vat_lieu', description: 'Giao vật liệu cho Lão Giả' }
    ],
    rewards: {
      exp: 200,
      // Thêm tiền tệ sau này
      reputation: 5
    },
    isRepeatable: true // Nhiệm vụ có thể lặp lại
  },
  // Nhiệm vụ khám phá
  explore_lair: {
    title: 'Thám Hiểm Sào Huyệt',
    description: 'Có tin đồn về một con Mãnh Hổ Vương Cấp trong khu công nghiệp cũ. Hãy đến Sào Huyệt Mãnh Hổ để xác nhận thông tin.',
    type: 'side',
    npcId: 'tinh_bao_vien', // NPC Giao nhiệm vụ
    requiredLevel: 8,
    objectives: [
      { type: 'explore', zoneId: 'sao_huyet_manh_ho_01', description: 'Tiến vào Sào Huyệt Mãnh Hổ' },
      { type: 'talk', npcId: 'tinh_bao_vien', description: 'Báo cáo thông tin cho Người Cung Cấp Tình Báo' }
    ],
    rewards: {
      exp: 500,
      reputation: 15
    }
  }
} as const satisfies Record<string, QuestTemplate> // Đảm bảo type safety

export type QuestId = keyof typeof quests
