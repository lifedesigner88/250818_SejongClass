import db from "~/db";
import { textbooksTable } from "~/feature/textbooks/schema";
import { eq } from "drizzle-orm";
import { checklistsTable } from "~/feature/checklists/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import { usersTable } from "~/feature/users/schema";

export async function getTextbookInfobyTextBookId(textbook_id: number, user_id: string) {
    return db.query.textbooksTable.findFirst({
        where: eq(textbooksTable.textbook_id, textbook_id),
        columns: {
            title: true,
            cover_image_url: true,
            youtube_video_id: true,
            price: true,
            can_enroll: true,
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
                },
            },
            enrollments: {
                where: eq(enrollmentsTable.user_id, user_id),
                columns: {
                    payment_status: true,
                    opened_chapter_ids: true
                }
            },
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
                                    is_free: true,
                                    is_published: true,
                                    estimated_seconds: true,
                                    updated_at: true,
                                    sort_order: true,
                                },
                                orderBy: (units, { asc }) => [asc(units.sort_order)],
                                with: {
                                    curriculums: {
                                        columns: {
                                            curriculum_id: true,
                                            code: true,
                                            achievement_text: true,
                                        },
                                        with: {
                                            checklists: {
                                                where: eq(checklistsTable.user_id, user_id),
                                                columns: {
                                                    completion_status: true,
                                                }
                                            }
                                        }
                                    },
                                    progress: {
                                        where: eq(checklistsTable.user_id, user_id),
                                        columns: {
                                            completion_status: true,
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

export const getEnrolledTextbooksByUserId = async (user_id: string) => {
    return db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, user_id),
        columns: {
            username: true,
        },
        with: {
            enrollments: {
                columns: {
                    review: true,
                    rating: true,
                    updated_at: true,
                    created_at: true,
                    progress_rate: true,
                },
                with: {
                    textbook: {
                        columns: {
                            title: true,
                            textbook_id: true,
                        },
                        with: {
                            subject: {
                                columns: {
                                    name: true,
                                    slug: true,
                                },
                                with: {
                                    theme: {
                                        columns: {
                                            name: true,
                                            slug: true,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    payment: true
                },
                orderBy: (enrollments, { asc }) => [asc(enrollments.progress_rate)],
            },
        },

    })
}
