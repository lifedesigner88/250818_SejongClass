import type { JSONContent } from "@tiptap/react";
import { eq, sql } from "drizzle-orm";
import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { majorsTable } from "~/feature/majors/schema";
import { middlesTable } from "~/feature/middles/schema";
import { progressTable } from "#app/feature/progress/schema.js";

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

export const completeUnitCheck = async (unit_id: number, user_id: string) => {
    await db.insert(progressTable).values({
        unit_id, 
        user_id
    })
}

// Update
export async function updateUnitReadmeContent(unit_id: number, readme_json: JSONContent) {
    return db.update(unitsTable)
        .set({ readme_json })
        .where(eq(unitsTable.unit_id, unit_id));
}

export const updateMajor = async (major_id: number, title: string, sort_order: number, textbook_id: number) => {
    return db.update(majorsTable)
        .set({
            title,
            sort_order,
            textbook_id
        })
        .where(eq(majorsTable.major_id, major_id));
}
export const updateMiddle = async (middle_id: number, title: string, sort_order: number, major_id: number) => {
    return db.update(middlesTable)
        .set({
            title,
            sort_order,
            major_id
        })
        .where(eq(middlesTable.middle_id, middle_id));
}
export const updateUnit = async (unit_id: number, title: string, sort_order: number,
    is_free: boolean, is_published: boolean, middle_chapter_id: number) => {
    return db.update(unitsTable)
        .set({
            title,
            sort_order,
            is_free,
            is_published,
            middle_chapter_id
        })
        .where(eq(unitsTable.unit_id, unit_id));
}

// Create
export const createMajor = async (textbook_id: number) => {
    return db.insert(majorsTable).values({
        textbook_id,
        title: "Major",
        sort_order: 99,
    })
}
export const createMiddle = async (major_id: number) => {
    return db.insert(middlesTable).values({
        major_id,
        title: "Middle",
        sort_order: 99,
    })
}
export const createUnit = async (middle_chapter_id: number) => {
    return db.insert(unitsTable).values({
        middle_chapter_id,
        title: "Unit",
        sort_order: 99,
    })
}

// Delete
export const deleteMajor = async (major_id: number) => {
    return db.delete(majorsTable).where(eq(majorsTable.major_id, major_id))
}
export const deleteMiddle = async (middle_id: number) => {
    return db.delete(middlesTable).where(eq(middlesTable.middle_id, middle_id))
}
export const deleteUnit = async (unit_id: number) => {
    return db.delete(unitsTable).where(eq(unitsTable.unit_id, unit_id))
}



// Update Time and YouTubeID
export const updateUnitVideo = async (unit_id: number, youtube_video_id: string, estimated_seconds: number) => {
    return db.update(unitsTable)
        .set({
            unit_id,
            youtube_video_id,
            estimated_seconds
        })
        .where(eq(unitsTable.unit_id, unit_id))

}



















