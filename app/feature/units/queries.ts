import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { eq } from "drizzle-orm";
import { notesTable } from "~/feature/note/schema";

export async function getUnitAndConceptsByUnitId(unit_id: number, user_id: string) {
    return db.query.unitsTable.findFirst({
        where: eq(unitsTable.unit_id, unit_id),
        columns: {
            unit_id: true,
            title: true,
            youtube_video_id: true,
            readme_content: true,
            readme_json: true,
            is_free: true,
            is_published: true,
            updated_at: true,
        },
        with: {
            middle: {
                columns: {
                    title: true,
                },
                with:{
                    major: {
                        columns: {
                            title: true,
                        },
                        with: {
                            textbook: {
                                columns: {
                                    textbook_id: true,
                                }
                            }
                        }
                    }
                }

            },
            dealings: {
                with: {
                    concept: {
                        columns: {
                            concept_id: true,
                            name: true,
                            slug: true,
                            definition: true,
                            name_eng: true,
                        },
                    }
                }
            },
            notes: {
                columns: {
                    readme_json: true,
                    updated_at: true,
                },
                where:eq(notesTable.user_id, user_id),
            }
        }
    });
}




