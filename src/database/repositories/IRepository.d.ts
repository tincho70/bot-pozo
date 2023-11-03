export interface IRepository<T> {
  getById(id: string): Promise<T | null>
  create(data: T): Promise<T | null>
  update(id: string, data: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
  // Updates (or insert) the prefix of a guild in the database.
  updatePrefix(id: string, prefix: string): Promise<T | null>
}
