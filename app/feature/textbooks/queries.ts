import db from "~/db";
import { textbooksTable } from "~/feature/textbooks/schema";
import { eq } from "drizzle-orm";

export async function getTextbookInfobyTextBookId(textbook_id: number) {
    return db.query.textbooksTable.findFirst({
        where: eq(textbooksTable.textbook_id, textbook_id),
        columns: {
            title: true,
            readme_content : true,
            cover_image_url: true,
            youtube_video_id: true,
            price: true,
        },
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
                    major_id: true,
                    title: true,
                    is_published: true,
                },
                orderBy: (majors, { asc }) => [asc(majors.sort_order)],
                with: {
                    middles: {
                        columns: {
                            middle_id: true,
                            title: true,
                            is_published: true,
                        },
                        orderBy: (middles, { asc }) => [asc(middles.sort_order)],
                        with: {
                            units: {
                                columns: {
                                    unit_id: true,
                                    title: true,
                                    is_published: true,
                                    estimated_seconds: true,
                                }                                ,
                                orderBy: (units, { asc }) => [asc(units.sort_order)],
                                with: {
                                    curriculums:{
                                        columns: {
                                            code: true,
                                            achievement_text: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}
