/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection } from "discord.js";
import { db } from "../database";
import { Guild, Partial } from "../entities/Guild";
import { IRepository } from "./IRepository";
import { Debugger } from "debug";
import { logger } from "../../helpers";

const log: Debugger = logger.extend("GuildRepository");
const error: Debugger = log.extend("error");

class GuildRepository implements IRepository<Guild> {
  private guilds: Collection<string, Guild> = new Collection();

  async getById(id: string): Promise<Guild | null> {
    try {
      // Get cached (if exists)
      if (this.guilds.has(id)) return this.guilds.get(id) as Guild;

      const query = "SELECT * FROM guild WHERE id = $1";
      const values = [id];
      const { rows } = await db.query(query, values);
      if (rows.length === 0) return null;
      this.guilds.set(id, rows[0]);
      return rows[0];
    } catch (err) {
      error("ERROR in Guild.getById:", err);
      return null;
    }
  }

  async create(guild: Guild): Promise<Guild | null> {
    try {
      const query =
        "INSERT INTO guild (id, joined_at, prefix, channel_id) VALUES ($1, $2) RETURNING *";
      const values = [guild.id, guild.joined_at];
      const { rows } = await db.query(query, values);
      if (rows.length === 0) return null;

      // Cache guild
      this.guilds.set(guild.id, rows[0]);
      return rows[0];
    } catch (err) {
      error("ERROR in Guild.create:", err);
      return null;
    }
  }

  async update(id: string, data: Partial<Guild>): Promise<Guild | null> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(data[key]);
          paramCount++;
        }
      }

      if (updateFields.length === 0) {
        log("No fields specified to update.");
        return null;
      }

      const query = `UPDATE guild SET ${updateFields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`;
      values.push(id);
      const { rows } = await db.query(query, values);
      if (rows.length === 0) return null;

      // Update cache
      this.guilds.set(id, rows[0]);
      return rows[0];
    } catch (err) {
      error("ERROR in Guild.update:", err);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    // Implementa la lógica de eliminación
    try {
      const query = "DELETE FROM guild WHERE id = $1";
      const values = [id];
      await db.query(query, values);
      return true;
    } catch (err) {
      error("ERROR in Guild.delete:", err);
      return false;
    }
  }
}

export const guildRepository = new GuildRepository();
