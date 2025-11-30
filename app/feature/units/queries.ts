import db from "~/db";
import { unitsTable } from "~/feature/units/schema";
import { eq, isNull } from "drizzle-orm";
import { notesTable } from "~/feature/note/schema";
import { commentLikesTable, commentsTable } from "~/feature/comments/schema";

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
                with: {
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
                where: eq(notesTable.user_id, user_id),
            },

            comments: {
                columns: {
                    comment_id: true,
                    content: true,
                    likes_count: true,
                    is_deleted: true,
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
                    likes:{
                        columns: {
                            comment_id: true,
                        },
                        where: eq(commentLikesTable.user_id, user_id),
                    },
                    comments:{
                        columns: {
                            comment_id: true,
                            content: true,
                            likes_count: true,
                            is_deleted: true,
                            is_edited: true,
                            updated_at: true,
                        },
                        orderBy: (comments, { asc }) => [asc(comments.created_at)],
                        with:{
                            user: {
                                columns: {
                                    user_id: true,
                                    username: true,
                                    profile_url: true,
                                    nickname: true,
                                }
                            },
                            likes:{
                                columns: {
                                    comment_id: true,
                                },
                                where: eq(commentLikesTable.user_id, user_id),
                            }
                        },
                    },
                }
            }
        },

    });
}




