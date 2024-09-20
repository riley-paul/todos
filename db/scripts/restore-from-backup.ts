import fs from "fs/promises";
import { db } from "astro:db";
import { allTables, type AnyTable } from "./_all-tables";

async function restoreFromBackup({ table, name }: AnyTable) {
  const file = await fs.readFile(`db/data/${name}.json`, "utf-8");
  const data = JSON.parse(file);

  try {
    await db.insert(table).values(data);
  } catch (error) {
    console.error(`Error restoring ${name}`);
    console.error(error);
    console.log(data.slice(0, 5));
  }
}

export default async function restoreAll() {
  for (const table of allTables.toReversed()) {
    await db.delete(table.table);
    console.log(`🗑️ Deleted ${table.name}`);
  }

  for (const table of allTables) {
    await restoreFromBackup(table);
    console.log(`✅ Restored ${table.name}`);
  }
}
