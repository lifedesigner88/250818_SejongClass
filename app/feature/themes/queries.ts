import db from "~/db";
import { themesTable } from "~/feature/themes/schema";

export async function getThemes() {
    return db.select()
        .from(themesTable)
        .orderBy(themesTable.sort_order);
}