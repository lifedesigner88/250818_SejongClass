import db from "~/db";
import { usersTable } from "~/feature/users/schema";
import { desc, eq } from "drizzle-orm";
import { advancedUsernameRegex } from "~/feature/users/pages/username-input";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import { notificationsTable } from "../notifications/schema";


function generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
}

export async function getPublicUserData(userId: string) {
    return db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, userId),
        with: {
            notifications: {
                columns: {
                    to_user_id: false,
                    from_user_id: false,
                    updated_at: false,
                },
                with: {
                    from: {
                        columns: {
                            nickname: true,
                            username: true,
                            profile_url: true,
                        }
                    },
                    comment: {
                        columns: {
                            content:true,
                            comment_id:true,
                        }
                    }
                },
                orderBy: [desc(notificationsTable.created_at)]
            }
        }
    });
}


export async function createPublicUserData(userData: {
    user_id: string;
    email: string;
    username: string;
    nickname: string;
    profile_url: string | null;
}) {
    let finalUsername = userData.username.substring(0, 19);
    let finalNickname = userData.nickname.substring(0, 19);

    while (true) {
        const existingUsername = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, finalUsername)
        });
        const regex = advancedUsernameRegex.test(finalUsername)
        if (existingUsername || !regex) {
            finalUsername = `${generateRandomString()}`;
        } else break;
    }

    while (true) {
        const existingNickname = await db.query.usersTable.findFirst({
            where: eq(usersTable.nickname, userData.nickname)
        })
        if (existingNickname) {
            finalNickname = `${finalNickname.substring(0, 8)}_${generateRandomString()}`;
        } else break;
    }

    const newUser = await db.insert(usersTable)
        .values({
            ...userData,
            username: finalUsername,
            nickname: finalNickname,
        })
        .returning();

    return newUser[0];
}


export const getActiveStamps = async (username: string) => {

    return db.query.usersTable.findFirst({
        where: eq(usersTable.username, username),
        columns: {
            role: false,
            email: false,
            user_id: false,
        },
        with: {
            visitlogs: {
                columns: {
                    updated_at: true,
                }
            },
            comments: {
                columns: {
                    updated_at: true,
                }
            },
            progress: {
                columns: {
                    updated_at: true,
                },
                with: {
                    unit: {
                        columns: {
                            estimated_seconds: true,
                        }
                    },
                },
            },
            checklists: {
                columns: {
                    updated_at: true,
                }
            },
            enrollments: {
                columns: {
                    review: true,
                    rating: true,
                    updated_at: true,
                    created_at: true,
                },
                where: eq(enrollmentsTable.progress_rate, 100),
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
                    }
                }
            }
        }
    })

}