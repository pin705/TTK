import type { IItem } from '~~/server/models/character.model'

interface MonsterOptions {
  level: number
  namePrefix: string
  nameSuffix: string
  element?: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' | 'Hắc Ám' | 'Ánh Sáng'
  possibleDrops: { item: IItem, chance: number, quantity: [number, number] }[]
}

// Hàm này sẽ tạo và lưu một quái vật vào DB
export async function generateMonster(options: MonsterOptions) {
  const { level, namePrefix, nameSuffix, element = 'none', possibleDrops } = options

  // 1. Tạo tên ngẫu nhiên
  const fullName = `${namePrefix} ${nameSuffix} Cấp ${level}`

  // 2. Random chỉ số dựa trên cấp độ
  const baseStat = level * 10
  const hp = baseStat * 5 + Math.floor(Math.random() * baseStat) // HP = 50-60 tại level 1
  const attack = baseStat + Math.floor(Math.random() * level * 2) // Attack = 10-12 tại level 1
  const defense = Math.floor(baseStat / 2) + Math.floor(Math.random() * level) // Defense = 5-6 tại level 1
  const expReward = baseStat * 2

  // 3. Xử lý vật phẩm rơi ra
  const drops = possibleDrops.map(drop => ({
    itemId: drop.item.itemId,
    dropChance: drop.chance,
    quantity: drop.quantity
  }))

  // 4. Tạo và trả về monster document
  const monster = new Monster({
    name: fullName,
    level,
    hp,
    attack,
    defense,
    element,
    expReward,
    drops,
    respawnTimeSeconds: 60 + level * 5
  })

  await monster.save()
  return monster
}
