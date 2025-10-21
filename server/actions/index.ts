import * as map from './map'
import * as resource from './resource'
import * as character from './character'

export const actions: Record<string, any> = {
  'map/move': map.move,
  'resource/gather': resource.gather,
  'character/cultivate': character.cultivate,
}
