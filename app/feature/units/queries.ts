import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { eq } from "drizzle-orm";
import type { JSONContent } from "@tiptap/react";

export async function getUnitAndConceptsByUnitId(unit_id: number) {
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
                columns: {},
                with:{
                    major: {
                        columns: {},
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
            }
        }
    });
}

export async function updateUnitReadmeContent(unit_id: number, readme_json: JSONContent) {
    return db.update(unitsTable)
        .set({ readme_json })
        .where(eq(unitsTable.unit_id, unit_id));
}


