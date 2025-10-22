import type { JSONContent } from "@tiptap/react";
import { eq, sql } from "drizzle-orm";
import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { majorsTable } from "~/feature/majors/schema";
import { middlesTable } from "~/feature/middles/schema";

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

export const updateMajor = async (major_id: number, title: string, sort_order: number) => {
    return db.update(majorsTable)
        .set({
            title,
            sort_order,
        })
        .where(eq(majorsTable.major_id, major_id));
}
export const updateMiddle = async (middle_id: number, title: string, sort_order: number) => {
    return db.update(middlesTable)
        .set({
            title,
            sort_order,
        })
        .where(eq(middlesTable.middle_id, middle_id));
}
export const updateUnit = async (unit_id: number, title: string, sort_order: number,
                                 is_free: boolean, is_published: boolean) => {
    return db.update(unitsTable)
        .set({
            title,
            sort_order,
            is_free,
            is_published
        })
        .where(eq(unitsTable.unit_id, unit_id));
}
