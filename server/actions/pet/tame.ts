import type { ActionHandler } from '../types'

export const tame: ActionHandler = async ({ character, payload }) => {
  const { monsterId } = payload as { monsterId: string }
  
  if (!character.combat || !character.inCombat) {
    throw new Error('Phải trong trạng thái chiến đấu để thuần hóa')
  }
  
  if (character.combat.monsterId !== monsterId) {
    throw new Error('Quái thú không khớp')
  }
  
  // Check if has slave ring
  const slaveRing = character.inventory.find(i => i.itemId === 'slave_ring')
  if (!slaveRing || slaveRing.quantity < 1) {
    throw new Error('Cần có [Vòng Nô Dịch] để thuần hóa')
  }
  
  // Check class - only Spirit Reader can tame beasts
  if (character.class !== 'SpiritReader') {
    throw new Error('Chỉ Niệm Sư mới có thể thuần hóa hung thú')
  }
  
  // Success rate based on monster HP
  const hpPercent = character.combat.monsterHp / 100 // Assume monsters have ~100 HP base
  const successRate = Math.max(0.1, 0.5 - (hpPercent * 0.4)) // Lower HP = higher success
  
  const success = Math.random() < successRate
  
  // Consume slave ring
  slaveRing.quantity -= 1
  if (slaveRing.quantity === 0) {
    character.inventory = character.inventory.filter(i => i.itemId !== 'slave_ring')
  }
  
  if (success) {
    // Create pet
    const pet = await Pet.create({
      ownerId: character._id,
      monsterId: character.combat.monsterId,
      name: character.combat.monsterName,
      level: 1,
      stats: {
        attack: 5,
        defense: 3,
        hp: 50,
        hpMax: 50
      }
    })
    
    // End combat
    character.combat = null
    character.inCombat = false
    
    return {
      log: [
        { type: 'system', message: `[HỆ THỐNG]: Thuần hóa thành công!` },
        { type: 'system', message: `[HỆ THỐNG]: [${pet.name}] đã trở thành thú cưng của bạn!` }
      ],
      updates: {
        inventory: character.inventory,
        combat: null,
        inCombat: false
      },
      petId: pet._id
    }
  } else {
    return {
      log: [
        { type: 'system', message: `[HỆ THỐNG]: Thuần hóa thất bại!` },
        { type: 'combat', message: `[CHIẾN ĐẤU]: [${character.combat.monsterName}] bị kích động và tấn công bạn!` }
      ],
      updates: {
        inventory: character.inventory
      }
    }
  }
}
