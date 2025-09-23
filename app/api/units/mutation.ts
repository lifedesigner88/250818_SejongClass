import type { JSONContent } from "@tiptap/react";
import { eq, sql } from "drizzle-orm";
import db from "~/db";
import { unitsTable } from "~/feature/units/schema";

export const toggleUnit = async (unitId: number, userId: string | null) => {
    await db.execute(sql`
        WITH deleted AS (
            DELETE FROM progress
                WHERE unit_id = ${unitId} AND user_id = ${userId}
                RETURNING 1 as deleted)
        INSERT
        INTO progress (unit_id, user_id)
        SELECT ${unitId}, ${userId}
        WHERE NOT EXISTS (SELECT 1 FROM deleted)
    `)
}

export async function updateUnitReadmeContent(unit_id: number, readme_json: JSONContent) {
    return db.update(unitsTable)
        .set({ readme_json })
        .where(eq(unitsTable.unit_id, unit_id));
}