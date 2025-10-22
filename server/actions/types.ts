import type { Document } from 'mongoose'
import type { LogPayload } from '../utils/logger'

export interface ActionContext {
  character: Document & ICharacter
  payload?: unknown
}

export interface ActionResult {
  log?: LogPayload[]
  updates: Record<string, unknown>
  [key: string]: unknown
}

export type ActionHandler = (context: ActionContext) => Promise<ActionResult>
