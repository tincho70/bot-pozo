/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Guild {
  id: string
  joined_at: Date
  prefix: string
  channel_id?: string
}

export interface Partial<Guild> {
  [key: string]: any
}
