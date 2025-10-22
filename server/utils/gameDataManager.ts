import { realms, zones, monsters, npcs, items, quests } from '~~/shared/config'
import type { RealmId, ZoneId, MonsterId } from '~~/shared/config' // Tạo file index để export type

// Quản lý Cảnh giới
export const CultivationManager = {
  getRealm(stageId: RealmId) {
    return realms[stageId]
  },
  getNextRealm(level: number) {
    const nextLevel = level + 1
    return Object.values(realms).find(r => r.level === nextLevel)
  }
}

// Quản lý Khu vực
export const ZoneManager = {
  getZone(zoneId: ZoneId) {
    return zones[zoneId]
  },
  getStartZone() {
    return zones['giang_nam_khu_dan_cu_01']
  }
}

// Quản lý Quái vật
export const MonsterManager = {
  getMonsterTemplate(monsterId: MonsterId) {
    return monsters[monsterId]
  }
}

// Quản lý NPC
export const NpcManager = {
  getNpc(npcId: string) {
    return npcs[npcId]
  }
}

// Quản lý Vật phẩm
export const ItemManager = {
  getItem(itemId: string) {
    return items[itemId]
  }
}

export const QuestManager = {
  getQuest(questId: string) {
    return quests[questId]
  }
}
