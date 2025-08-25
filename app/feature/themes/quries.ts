import db from "~/db";

export async function getThemesWithSubjects() {
    return db.query.themesTable.findMany({
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
                                                orderBy: (units, { asc }) => [asc(units.sort_order)]
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
}



