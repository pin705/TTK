import * as map from './map'
import * as resource from './resource'
import * as character from './character'
import * as combat from './combat'
import * as npc from './npc'

export const actions: Record<string, unknown> = {
  'map/move': map.move,
  'resource/gather': resource.gather,
  'character/cultivate': character.cultivate,
  'combat/initiate': combat.initiate,
  'combat/attack': combat.attack,
  'npc/talk': npc.talk
}
