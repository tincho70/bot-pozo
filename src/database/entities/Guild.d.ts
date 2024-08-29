/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Guild {
  id: string
  joined_at: Date
}

export interface Partial<Guild> {
  [key: string]: any
}
