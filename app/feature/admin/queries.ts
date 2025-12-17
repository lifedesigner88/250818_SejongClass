import db from "#app/db/index.js";
import { desc, eq } from "drizzle-orm";
import { commentsTable } from "../comments/schema";


export async function getCommentsToAdmin() {
    return db.query.commentsTable.findMany({
        where: eq(commentsTable.is_admin_checked, false),
        orderBy: desc(commentsTable.updated_at),
        columns: {
            comment_id: true,
            content: true,
            is_edited: true,
            parent_comment_id: true,
            likes_count: true,
            updated_at:true,
            created_at:true
        },
        with: {
            user: {
                columns: {
                    username: true,
                    nickname: true,
                    profile_url: true,
                },
            },
            unit: {
                columns: {
                    unit_id: true,
                    title: true
                },
                with: {
                    middle: {
                        columns: {},
                        with: {
                            major: {
                                columns: {},
                                with: {
                                    textbook: {
                                        columns: {
                                            textbook_id: true,
                                            title: true,
                                            slug: true,
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
                                                            slug: true
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


    })

}