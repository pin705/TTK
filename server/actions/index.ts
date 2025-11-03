import * as map from './map'
import * as resource from './resource'
import * as character from './character'
import * as combat from './combat'
import * as npc from './npc'
import * as quest from './quest'
import * as guild from './guild'
import * as market from './market'
import * as pet from './pet'
import * as ship from './ship'
import * as party from './party'
import * as crafting from './crafting'
import * as equipment from './equipment'
import * as housing from './housing'

export const actions: Record<string, unknown> = {
  'map/move': map.move,
  'resource/gather': resource.gather,
  'character/cultivate': character.cultivate,
  'combat/initiate': combat.initiate,
  'combat/attack': combat.attack,
  'npc/talk': npc.talk,
  'character/breakthrough': character.breakthrough,
  'character/updateAvatar': character.updateAvatar,
  'character/passiveRecoveryTick': character.passiveRecoveryTick,
  'character/meditate': character.meditate,
  'character/allocateStat': character.allocateStat,
  'quest/claim': quest.claim,
  'quest/accept': quest.accept,
  'character/cultivationTick': character.cultivationTick,
  // Evolution system actions
  'character/absorbEnergy': character.absorbEnergy,
  'character/geneBreakthrough': character.geneBreakthrough,
  'character/equipModule': character.equipModule,
  'character/activateModule': character.activateModule,
  // Guild system actions
  'guild/create': guild.create,
  'guild/invite': guild.invite,
  'guild/declareWar': guild.declareWar,
  // Market system actions
  'market/sell': market.sell,
  'market/search': market.search,
  'market/buy': market.buy,
  // Pet system actions
  'pet/tame': pet.tame,
  'pet/activate': pet.activate,
  'pet/setMode': pet.setMode,
  'pet/breed': pet.breed,
  'pet/evolve': pet.evolve,
  // Ship/Space travel actions
  'ship/travelTo': ship.travelTo,
  'ship/refuel': ship.refuel,
  // Party system actions
  'party/invite': party.invite,
  // Crafting system actions
  'crafting/craft': crafting.craft,
  'crafting/research': crafting.research,
  // Spirit Reader combat
  'combat/spiritAttack': combat.spiritAttack,
  // Equipment enhancement
  'equipment/enhance': equipment.enhanceEquipment,
  // Racial skills
  'character/useRacialSkill': character.useRacialSkill,
  // Transformation (Feature 3)
  'character/transform': character.transform,
  // Housing (Feature 8)
  'housing/unlockHousing': housing.unlockHousing,
  'housing/build': housing.build,
  'housing/furnish': housing.furnish,
}
