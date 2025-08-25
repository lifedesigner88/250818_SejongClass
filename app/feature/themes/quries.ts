import db from "~/db";
import { prerequisitesTable } from "~/feature/prerequisites/schema";
import { conceptsTable } from "~/feature/concepts/schema";
import { eq } from "drizzle-orm";

export async function getThemesWithSubjects() {
    const startTime = performance.now();

    const result = await db.query.themesTable.findMany({
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
                orderBy: (subjects, { asc }) => [asc(subjects.sort_order)],
                with: {
                    textbooks: {
                        columns: {
                            textbook_id: true,
                            title: true,
                            is_published: true,
                            sort_order: true,
                        },
                        orderBy: (textbooks, { asc }) => [asc(textbooks.sort_order)],
                        with: {
                            majors: {
                                columns: {
                                    major_id: true,
                                    title: true,
                                    is_published: true,
                                    sort_order: true,
                                },
                                orderBy: (majors, { asc }) => [asc(majors.sort_order)],
                                with: {
                                    middles: {
                                        columns: {
                                            middle_id: true,
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
                                                    youtube_video_id: true,
                                                    estimated_duration: true,
                                                    is_published: true,
                                                    sort_order: true,
                                                },
                                                orderBy: (units, { asc }) => [asc(units.sort_order)],
                                                with: {
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
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`🚀 Query execution time: ${duration.toFixed(2)}ms`);

    return result;
}


export const conceptWithPrerequisites = await db.query.conceptsTable.findFirst({
    where: eq(conceptsTable.concept_id, 2),
    with: {
        prerequisites: {
            with: {
                prerequisiteConcept: true, // 선행조건이 되는 개념 정보도 함께 조회
            },
            orderBy: prerequisitesTable.sort_order,
        },
    },
});

// 특정 개념을 선행조건으로 갖는 모든 개념들 조회
export const conceptWithDependents = await db.query.conceptsTable.findFirst({
    where: eq(conceptsTable.concept_id, 1),
    with: {
        dependentConcepts: {
            with: {
                mainConcept: true, // 이 개념을 선행조건으로 갖는 개념 정보도 함께 조회
            },
            orderBy: prerequisitesTable.sort_order,
        },
    },
});


