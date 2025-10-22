export const quests = {
  first_hunt: {
    title: 'Chuyến Đi Săn Đầu Tiên',
    npcId: 'vo_su_truong', // NPC giao nhiệm vụ
    requiredLevel: 1,
    description: 'Căn cứ cần một số vật liệu từ lũ Lợn Rừng Nanh Máu ở khu hoang dã. Hãy chứng tỏ thực lực của cậu đi.',
    objectives: [
      { type: 'kill', monsterId: 'bloodfang_boar', count: 5 },
      { type: 'gather', itemId: 'monster_hide_low', count: 3 }
    ],
    rewards: {
      exp: 150,
      items: [{ itemId: 'standard_combat_knife', quantity: 1 }],
      reputation: 10
    }
  }
} as const

export type QuestId = keyof typeof quests
