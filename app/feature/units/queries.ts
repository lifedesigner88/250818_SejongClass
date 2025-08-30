import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { eq } from "drizzle-orm";

export async function getUnitAndConceptsByUnitId(unit_id: number) {
    return db.query.unitsTable.findFirst({
        where: eq(unitsTable.unit_id, unit_id),
        columns: {
            unit_id: true,
            title: true,
            youtube_video_id: true,
            readme_content: true,
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