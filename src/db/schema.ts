import { mysqlTable, varchar, text, timestamp, boolean } from "drizzle-orm/mysql-core";

export const playerStats = mysqlTable("player_stats", {
  id: varchar("id", { length: 300 }).notNull().primaryKey(), // Combo ID, used to write data avoiding duplicates
  uuid: varchar("uuid", { length: 36 }).notNull(),
  statName: varchar("stat_name", { length: 255 }).notNull(),
  statValue: text("stat_value").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  public: boolean("public").default(false).notNull()
});