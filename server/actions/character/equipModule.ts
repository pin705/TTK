import type { ActionContext } from '../types'
import { items } from '~~/shared/config/items'

/**
 * Equip or unequip body augmentation modules
 */
export async function equipModule({ character, payload }: ActionContext) {
  const moduleId = (payload as any)?.moduleId as string
  const slotType = (payload as any)?.slot as 'cultivation' | 'combat' | 'survival'

  // Initialize evolution if not exists
  if (!character.evolution) {
    return {
      log: { message: 'Hệ thống tiến hóa chưa được kích hoạt.', type: 'error' }
    }
  }

  // Check if unequipping
  if (!moduleId || moduleId === 'none') {
    const currentModule = character.evolution.modules?.[slotType]
    if (currentModule) {
      // Return module to inventory
      const existing = character.inventory.find(item => item.itemId === currentModule)
      if (existing) {
        existing.quantity += 1
      } else {
        character.inventory.push({ itemId: currentModule, quantity: 1 })
      }
      
      character.evolution.modules[slotType] = null
      await character.save()
      
      return {
        log: { message: `Đã gỡ module từ khe ${slotType}.`, type: 'success' },
        updates: { character }
      }
    } else {
      return {
        log: { message: 'Khe này đang trống.', type: 'error' }
      }
    }
  }

  // Check if item exists and is a module
  const item = items[moduleId as keyof typeof items]
  if (!item) {
    return {
      log: { message: 'Module không tồn tại.', type: 'error' }
    }
  }

  // Verify module type matches slot
  const expectedType = `module_${slotType}`
  if (!item.type.startsWith('module_')) {
    return {
      log: { message: 'Vật phẩm này không phải là module.', type: 'error' }
    }
  }

  if (item.type !== expectedType) {
    return {
      log: { message: `Module này không phù hợp với khe ${slotType}.`, type: 'error' }
    }
  }

  // Check if player has the module in inventory
  const hasModule = character.inventory.find(i => i.itemId === moduleId && i.quantity > 0)
  if (!hasModule) {
    return {
      log: { message: 'Bạn không có module này trong túi đồ.', type: 'error' }
    }
  }

  // Unequip current module if any
  const currentModule = character.evolution.modules?.[slotType]
  if (currentModule) {
    const existing = character.inventory.find(i => i.itemId === currentModule)
    if (existing) {
      existing.quantity += 1
    } else {
      character.inventory.push({ itemId: currentModule, quantity: 1 })
    }
  }

  // Equip new module
  hasModule.quantity -= 1
  if (hasModule.quantity <= 0) {
    character.inventory = character.inventory.filter(i => i.itemId !== moduleId || i.quantity > 0)
  }

  character.evolution.modules[slotType] = moduleId

  await character.save()

  return {
    log: { 
      message: `Đã trang bị ${item.name} vào khe ${slotType}.`, 
      type: 'success' 
    },
    updates: { character }
  }
}
