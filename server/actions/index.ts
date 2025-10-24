import * as map from './map'
import * as resource from './resource'
import * as character from './character'
import * as combat from './combat'
import * as npc from './npc'
import * as quest from './quest'

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
}
