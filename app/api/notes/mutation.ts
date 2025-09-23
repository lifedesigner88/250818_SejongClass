import db from "~/db";
import { notesTable } from "~/feature/note/schema";

export const createUserNote = async (user_id: string, unit_id: number) => {
    return db.insert(notesTable).values({
        user_id,
        unit_id,
    })
}