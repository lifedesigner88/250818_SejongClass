import { curriculumsTable } from "#app/feature/curriculums/schema.js";
import type { CurriculumListType } from "#app/feature/units/pages/unit-page.js";
import { eq, sql } from "drizzle-orm";
import db from "~/db";

export const toggleCurriculum = async (curriculumId: number, userId: string) => {
    await db.execute(sql`
        WITH deleted AS (
            DELETE FROM checklists
                WHERE curriculum_id = ${curriculumId} AND user_id = ${userId}
                RETURNING 1 as deleted)
        INSERT
        INTO checklists (curriculum_id, user_id)
        SELECT ${curriculumId}, ${userId}
        WHERE NOT EXISTS (SELECT 1 FROM deleted)
    `)
}

export const createNewCurriculum = async (unit_id: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomCode = Array.from({ length: 4 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return db.insert(curriculumsTable).values({
        unit_id,
        achievement_text: "새 성취기준 추가",
        code: `${randomCode}-${unit_id}`,
    })
}


export const deleteCurriculum = async (curriculum_id: number) => {
    return db.delete(curriculumsTable).where(eq(curriculumsTable.curriculum_id, curriculum_id))
}


export const updateCurriculum = async (
    curriculum_id: number,
    sort_order: number,
    code: string,
    achievement_text: string
) => {
    return db.update(curriculumsTable).set({
        sort_order,
        code,
        achievement_text
    }).where(
        eq(curriculumsTable.curriculum_id, curriculum_id)
    )
}

// db 로직 파일
export const upsertCurriculums = async (dataList: CurriculumListType) => {
    return db.transaction(async (tx) => {
        for (const item of dataList) {
            await tx
                .update(curriculumsTable)
                .set({
                    sort_order: item.sort_order,
                    code: item.code,
                    achievement_text: item.achievement_text,
                })
                .where(eq(curriculumsTable.curriculum_id, item.curriculum_id));
        }
    });
};