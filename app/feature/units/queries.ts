import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { eq, isNull } from "drizzle-orm";
import { commentLikesTable, commentsTable } from "~/feature/comments/schema";
import { progressTable } from "../progress/schema";
import { enrollmentsTable } from "../enrollments/schema";

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
            estimated_seconds: true,
        },
        with: {
            middle: {
                columns: {
                    title: true,
                },
                with: {
                    major: {
                        columns: {
                            title: true,
                        },
                        with: {
                            textbook: {
                                columns: {
                                    textbook_id: true,
                                    title: true,
                                },
                                with: {
                                    enrollments: {
                                        columns: {
                                            review: true,
                                            rating: true
                                        },
                                        where: eq(enrollmentsTable.user_id, user_id)
                                    }
                                }
                            }
                        }
                    }
                }

            },
            progress: {
                columns: {
                    completion_status: true
                },
                where: eq(progressTable.user_id, user_id)
            },
            comments: {
                columns: {
                    comment_id: true,
                    content: true,
                    likes_count: true,
                    is_edited: true,
                    updated_at: true,
                },
                orderBy: (comments, { desc }) => [desc(comments.created_at)],
                where: isNull(commentsTable.parent_comment_id),
                with: {
                    user: {
                        columns: {
                            user_id: true,
                            username: true,
                            profile_url: true,
                            nickname: true,
                        }
                    },
                    likes: {
                        columns: {
                            comment_id: true,
                        },
                        where: eq(commentLikesTable.user_id, user_id),
                    },
                    comments: {
                        columns: {
                            comment_id: true,
                            content: true,
                            likes_count: true,
                            is_edited: true,
                            updated_at: true,
                        },
                        orderBy: (comments, { asc }) => [asc(comments.created_at)],
                        with: {
                            user: {
                                columns: {
                                    user_id: true,
                                    username: true,
                                    profile_url: true,
                                    nickname: true,
                                }
                            },
                            likes: {
                                columns: {
                                    comment_id: true,
                                },
                                where: eq(commentLikesTable.user_id, user_id),
                            },
                            mention: {
                                columns: {
                                    username: true
                                }
                            }
                        },
                    },
                }
            }
        },

    });
}




