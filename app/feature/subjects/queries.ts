import db from "~/db";
import { eq } from "drizzle-orm";
import { themesTable } from "~/feature/themes/schema";

export async function getTextbooksBySubjectSlug(slug: string) {
    console.log(slug, "함수내부");

    return db.query.themesTable.findFirst({
        where: eq(themesTable.slug, slug),
        with: {
            subjects: {
                with: {
                    textbooks: true
                }
            }
        }
    });
}