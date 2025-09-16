import db from "~/db";
import { eq } from "drizzle-orm";
import { themesTable } from "~/feature/themes/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";

export async function getTextbooksByTheamSlug(slug: string, userId: string) {
    return db.query.themesTable.findFirst({
        where: eq(themesTable.slug, slug),
        with: {
            subjects: {
                with: {
                    textbooks: {
                        with: {
                            enrollments: {
                                columns: {
                                    progress_rate: true,
                                    created_at: true,
                                    updated_at: true,
                                    last_study_date: true,
                                },
                                where: eq(enrollmentsTable.user_id, userId),
                            }
                        },
                        orderBy: (textbooks, { asc }) => [asc(textbooks.sort_order)]
                    }
                }
            }
        }
    });
}