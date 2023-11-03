/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection } from 'discord.js'
import { db } from '../database'
import { Guild, Partial } from '../entities/Guild'
import { IRepository } from './IRepository'

class GuildRepository implements IRepository<Guild> {
  private guilds: Collection<string, Guild> = new Collection()

  async getById(id: string): Promise<Guild | null> {
    try {
      // Get cached (if exists)
      if (this.guilds.has(id)) return this.guilds.get(id) as Guild

      const query = 'SELECT * FROM guild WHERE id = $1'
      const values = [id]
      const { rows } = await db.query(query, values)
      if (rows.length === 0) return null
      this.guilds.set(id, rows[0])
      return rows[0]
    } catch (error) {
      console.error('ERROR in Guild.getById:', error)
      return null
    }
  }

  async create(guild: Guild): Promise<Guild | null> {
    try {
      const query =
        'INSERT INTO guild (id, joined_at, prefix, channel_id) VALUES ($1, $2, $3, $4) RETURNING *'
      const values = [guild.id, guild.joined_at, guild.prefix, guild.channel_id]
      const { rows } = await db.query(query, values)
      if (rows.length === 0) return null

      // Cache guild
      this.guilds.set(guild.id, rows[0])
      return rows[0]
    } catch (error) {
      console.error('ERROR in Guild.create:', error)
      return null
    }
  }

  async update(id: string, data: Partial<Guild>): Promise<Guild | null> {
    try {
      const updateFields: string[] = []
      const values: any[] = []
      let paramCount = 1

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          updateFields.push(`${key} = $${paramCount}`)
          values.push(data[key])
          paramCount++
        }
      }

      if (updateFields.length === 0) {
        console.warn('No se especificaron campos para actualizar.')
        return null
      }

      const query = `UPDATE guild SET ${updateFields.join(
        ', '
      )} WHERE id = $${paramCount} RETURNING *`
      values.push(id)
      const { rows } = await db.query(query, values)
      if (rows.length === 0) return null

      // Update cache
      this.guilds.set(id, rows[0])
      return rows[0]
    } catch (error) {
      console.error('ERROR in Guild.update:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    // Implementa la lógica de eliminación
    try {
      const query = 'DELETE FROM guild WHERE id = $1'
      const values = [id]
      await db.query(query, values)
      return true
    } catch (error) {
      console.error('ERROR in Guild.delete:', error)
      return false
    }
  }

  /**
   * Updates the prefix of a guild in the database.
   * If the guild doesn't exists, then insert in the database.
   *
   * @param {string} id - The ID of the guild.
   * @param {string} prefix - The new prefix to be set.
   * @return {Promise<Guild | null>} - A Promise that resolves to the updated guild object or null if the guild does not exist.
   */
  async updatePrefix(id: string, prefix: string): Promise<Guild | null> {
    try {
      const updated = this.update(id, { prefix: prefix })
      if (!updated) {
        const guild = this.create({
          id,
          joined_at: new Date(),
          prefix,
          channel_id: undefined, // Default value
        })
        return guild || null
      }
      return updated || null
    } catch (error) {
      console.error('ERROR in Guild.update:', error)
      return null
    }
  }

  async updateReportChannel(
    id: string,
    channel_id: string
  ): Promise<Guild | null> {
    try {
      const updated = this.update(id, { channel_id: channel_id })
      if (!updated) {
        const guild = this.create({
          id,
          joined_at: new Date(),
          prefix: process.env.DISCORD_COMMAND_PREFIX, // Default value
          channel_id: channel_id,
        })
        return guild || null
      }
      return updated || null
    } catch (error) {
      console.error('ERROR in Guild.update:', error)
      return null
    }
  }
}

export const guildRepository = new GuildRepository()
