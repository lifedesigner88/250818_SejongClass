import { sql } from "drizzle-orm";
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