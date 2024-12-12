import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { playerStats } from "./schema";
import { StatArray } from "../server";
import { eq } from 'drizzle-orm';
import mysql from "mysql2/promise";


const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL
});
const db = drizzle({ client: poolConnection });

export default async function writeStats(statID: string, records: StatArray): Promise<void> {
  for (const record of records) {
    const statRecord: typeof playerStats.$inferInsert = {
      id: `${statID}-${record.uuid}`,
      uuid: record.uuid.toString(),
      statValue: record.value,
      statName: statID
    };

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
      await db
        .delete(playerStats)
        .where(eq(playerStats.id, `${statID}-${record.uuid}`))
        .limit(1)
        .execute()
    }

    await db
      .insert(playerStats)
      .values(statRecord)
      .execute();   
  }
}