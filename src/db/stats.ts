import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { playerStats } from "./schema";
import { StatArray, PublicSettings } from "../server";
import { eq } from 'drizzle-orm';
import mysql from "mysql2/promise";
import { UserStats } from '../player';
import { UUIDTypes } from 'uuid';

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL
});
const db = drizzle({ client: poolConnection });

export async function writeStats(statID: string, records: StatArray): Promise<boolean> {
  if (process.env.NODE_ENV === "test") return true;
  try {
    for (const record of records) {
      let statPublic: boolean = false;

      // Safety check - Check if the record already exists before continuing
      // Used to know whether or not to delete the existing data.
      // May not be needed, just here to preserve data integrity.
      const query = await db
        .select()
        .from(playerStats)
        .where(eq(playerStats.id, `${statID}-${record.uuid}`))
        .limit(1);

      // Delete existing data before writing new data
      if (query.length !== 0) {
        statPublic = query[0].public;
        await db
          .delete(playerStats)
          .where(eq(playerStats.id, `${statID}-${record.uuid}`))
          .limit(1)
          .execute()
      }

      const statRecord: typeof playerStats.$inferInsert = {
        id: `${statID}-${record.uuid}`,
        uuid: record.uuid.toString(),
        statValue: record.value,
        statName: statID,
        public: statPublic
      };

      await db
        .insert(playerStats)
        .values(statRecord)
        .execute();   
    }
    return true;
  } catch (e) {
    console.error("[db] Database error: " + e)
    return false;
  }
}

export async function readStats(uuid: string): Promise<UserStats | null> {
  if (process.env.NODE_ENV === "test") return null;
  try {
    const query = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.uuid, uuid))
    const list: UserStats = [];
    for (const stat of query) {
      list.push({
        statID: stat.statName,
        value: stat.statValue,
        timestamp: stat.lastUpdated,
        public: stat.public
      });
    }
    return list;
  } catch (e) {
    console.error("[db] Database error: " + e)
    return null;
  }
}

export async function setStatPrivacy(uuid: UUIDTypes, stats: PublicSettings): Promise<boolean> {
  if (process.env.NODE_ENV === "test") return true;
  try {
    for (const setting of stats) {
      await db
        .update(playerStats)
        .set({ public: setting.public })
        .where(eq(playerStats.id, `${setting.stat}-${uuid}`))
        .execute();
    }
    return true;
  } catch (e) {
    console.error("[db] Database error: " + e)
    return false;
  }
}