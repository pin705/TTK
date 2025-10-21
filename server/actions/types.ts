import type { Document } from 'mongoose'
import { ICharacter } from '../models/character.model'

export interface ActionContext {
  character: Document & ICharacter // Nhân vật thực hiện hành động
  payload?: any
}

export interface ActionResult {
  log: string | string[] // Thông báo log để hiển thị cho người chơi
  updates: Record<string, any> // Dữ liệu để cập nhật state trên client (player, zone...)
  [key: string]: any
}

export type ActionHandler = (context: ActionContext) => Promise<ActionResult>
