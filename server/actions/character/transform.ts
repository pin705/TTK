// Racial Transformation System (Feature 3)
import type { ActionHandler } from '../types'
import { gameSettings } from '~/shared/config/gameSettings'
import { transformationForms } from '~/shared/config/races'

export const transform: ActionHandler = async (character, payload, log) => {
  const { formId } = payload as { formId: string }

  // Check if transformation form exists
  const form = transformationForms[formId as keyof typeof transformationForms]
  if (!form) {
    log('SYSTEM', 'Hình thái biến hình không tồn tại.')
    return { success: false }
  }

  // Check if already transformed
  if (character.transformationActive) {
    log('SYSTEM', 'Bạn đã đang trong trạng thái biến hình.')
    return { success: false }
  }

  // Check transformation cooldown
  if (character.lastTransformTime) {
    const timeSinceTransform = Date.now() - character.lastTransformTime.getTime()
    if (timeSinceTransform < gameSettings.transformation.cooldown * 1000) {
      const remainingTime = Math.ceil((gameSettings.transformation.cooldown * 1000 - timeSinceTransform) / 1000 / 60)
      log('SYSTEM', `Phải chờ ${remainingTime} phút nữa mới có thể biến hình.`)
      return { success: false }
    }
  }

  // Check if character has required item for special forms
  if (form.requiredItem) {
    const hasItem = character.inventory.some(item => item.itemId === form.requiredItem)
    if (!hasItem) {
      log('SYSTEM', `Cần ${form.requiredItem} để mở khóa hình thái này.`)
      return { success: false }
    }
  }

  // Check energy cost
  if (character.energy < gameSettings.transformation.energyCost) {
    log('SYSTEM', `Cần ${gameSettings.transformation.energyCost} năng lượng để biến hình.`)
    return { success: false }
  }

  // Consume energy
  character.energy -= gameSettings.transformation.energyCost

  // Activate transformation
  character.transformationActive = true
  character.transformationForm = formId
  character.transformationEndTime = new Date(Date.now() + gameSettings.transformation.baseDuration * 1000)
  character.lastTransformTime = new Date()

  // Apply stat boosts (stored for later calculation)
  character.transformationStats = {
    attackMult: form.statMultipliers.attack,
    defenseMult: form.statMultipliers.defense,
    speedMult: form.statMultipliers.speed,
    spiritMult: form.statMultipliers.spirit,
    hpMaxMult: form.statMultipliers.hpMax,
    energyMaxMult: form.statMultipliers.energyMax
  }

  await character.save()

  log('TRANSFORMATION', `Kích hoạt [${form.nameVi}]!`)
  log('TRANSFORMATION', form.description)
  log('SYSTEM', form.visualEffect)
  log('SYSTEM', `Thời gian duy trì: ${gameSettings.transformation.baseDuration / 60} phút.`)
  log('SYSTEM', `Năng lượng tiêu hao: ${gameSettings.transformation.energyCost}`)

  return { success: true }
}
