import db from "~/db";
import { eq, and, sql } from "drizzle-orm";
import { textbooksTable } from "~/feature/textbooks/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";


export const getTextbookPrice = async (textbook_id: number) => {
    return await db.query.textbooksTable.findFirst({
        where: eq(textbooksTable.textbook_id, textbook_id),
        columns: {
            price: true,
        },
    });
}

export const enrollFreeTextbook = async (textbook_id: number, user_id: string) => {
    return db.insert(enrollmentsTable).values({
        user_id,
        textbook_id,
    }).returning();
}

export const incrementEnrolledStudents = async (textbook_id: number) => {
    return db.update(textbooksTable)
        .set({
            enrolled_students: sql`${textbooksTable.enrolled_students} + 1`
        })
        .where(eq(textbooksTable.textbook_id, textbook_id)).returning()
}

export const updateEnrolledProgress = async (textbook_id: number, user_id: string, progress_rate: number) => {
    return db.update(enrollmentsTable)
        .set({
            progress_rate: progress_rate,
            last_study_date: new Date(),
        })
        .where(
            and(
                eq(enrollmentsTable.user_id, user_id),
                eq(enrollmentsTable.textbook_id, textbook_id)
            )
        )
}
