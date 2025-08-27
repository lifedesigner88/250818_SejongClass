import db from "~/db";
import { eq } from "drizzle-orm";
import { themesTable } from "~/feature/themes/schema";

export async function getTextbooksByTheamSlug(slug: string) {
    console.log(slug, "inside function");

    return db.query.themesTable.findFirst({
        where: eq(themesTable.slug, slug),
        with: {
            subjects: {
                with: {
                    textbooks: {
                        orderBy: (textbooks, { asc }) => [asc(textbooks.sort_order)]
                    }
                }
            }
        }
    });
}