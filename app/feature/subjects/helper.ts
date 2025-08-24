import { themesTable } from "~/feature/themes/schema";
import { db } from "~/db";


type NewTheme = typeof themesTable.$inferInsert;
type ThemeSelect = typeof themesTable.$inferSelect;

export async function createTheme(data: NewTheme) {
    const [result] = await db.insert(themesTable).values(data).returning();
    return result;
}

export async function getThemes(): Promise<ThemeSelect[]> {
    return db.select().from(themesTable).orderBy(themesTable.sort_order);
}