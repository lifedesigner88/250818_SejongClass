import db from "~/db";

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
        }
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`🚀 Query execution time: ${duration.toFixed(2)}ms`);
    console.log(`📊 Total themes: ${result.length}`);

    // 더 자세한 통계
    const totalSubjects = result.reduce((acc, theme) => acc + theme.subjects.length, 0);
    const totalTextbooks = result.reduce((acc, theme) =>
        acc + theme.subjects.reduce((subAcc, subject) => subAcc + subject.textbooks.length, 0), 0);

    console.log(`📚 Total subjects: ${totalSubjects}`);
    console.log(`📖 Total textbooks: ${totalTextbooks}`);

    return result;
}



