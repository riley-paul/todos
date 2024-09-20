import fs from "fs/promises";
import { db } from "astro:db";
import { allTables } from "./_all-tables";

export default async function downloadAll() {
  await fs.rm("db/data", { recursive: true, force: true });
  await fs.mkdir("db/data", { recursive: true });

  for (const { table, name } of allTables) {
    const rows = await db.select().from(table);
    await fs.writeFile(`db/data/${name}.json`, JSON.stringify(rows, null, 2));
  }
}
