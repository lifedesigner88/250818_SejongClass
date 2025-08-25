import db from "~/db";
import { themesTable } from "~/feature/themes/schema";

export async function getThemes() {
    return db.select().from(themesTable).orderBy(themesTable.sort_order);
}


export async function getThemesWithSubjects() {
    return db.query.themesTable.findMany({
        columns: {
            themes_id: true,
            name: true,
            is_active: true,
            sort_order: true,
        },
        orderBy: (themes, { asc }) => [asc(themes.sort_order)],
        with: {
            subjects: {
                columns: {
                    subject_id: true,
                    name: true,
                    is_active: true,
                    sort_order: true,
                },
                orderBy: (subjects, { asc }) => [asc(subjects.sort_order)]
            }
        }
    });
}

