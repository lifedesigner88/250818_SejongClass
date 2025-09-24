import type { JSONContent } from "@tiptap/react";
import { and, eq } from "drizzle-orm";
import db from "~/db";
import { notesTable } from "~/feature/note/schema";

export const createUserNote = async (user_id: string, unit_id: number) => {
    return db.insert(notesTable).values({
        user_id,
        unit_id,
    })
}

export async function updateUserNote(userId: string, unit_id: number, readme_json: JSONContent) {
    return db.update(notesTable)
        .set({ readme_json })
        .where(and(
            eq(notesTable.user_id, userId),
            eq(notesTable.unit_id, unit_id)
        ));
}

export async function deleteUserNote(userId: string, unit_id: number) {
    return db.delete(notesTable)
        .where(and(
            eq(notesTable.user_id, userId),
            eq(notesTable.unit_id, unit_id)
        ));
}
