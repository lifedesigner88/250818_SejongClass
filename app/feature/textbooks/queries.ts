import db from "~/db";
import { textbooksTable } from "~/feature/textbooks/schema";
import { eq } from "drizzle-orm";

export async function getTextbookInfobyTextBookId(textbook_id: number) {
    return db.query.textbooksTable.findFirst({
        where: eq(textbooksTable.textbook_id, textbook_id),
        with: {
            subject: {
                columns: {
                    slug: true,
                },
                with: {
                    theme: {
                        columns: {
                            slug: true,
                        }
                    }
                }
            },
            majors: {
                columns: {
                    title: true,
                    is_published: true,
                    sort_order: true,
                },
                orderBy: (majors, { asc }) => [asc(majors.sort_order)],
                with: {
                    middles: {
                        columns: {
                            title: true,
                            is_published: true,
                            sort_order: true,
                        },
                        orderBy: (middles, { asc }) => [asc(middles.sort_order)],
                        with: {
                            units: {
                                columns: {
                                    unit_id: true,
                                    title: true,
                                    is_published: true,
                                    sort_order: true,
                                    estimated_seconds: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}
