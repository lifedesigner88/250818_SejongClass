import db from "~/db";
import { usersTable } from "~/feature/users/schema";
import { eq } from "drizzle-orm";

function generateRandomString(length: number = 6): string {
    return Math.random().toString(36).substring(2, length + 2);
}

export async function getPublicUserData(userId: string) {
    return db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, userId)
    });
}

export async function createPublicUserData(userData: {
    user_id: string;
    email: string;
    username: string;
    nickname: string | null;
    profile_url: string | null;
}) {
    let finalUsername = userData.username;
    let finalEmail = userData.email;

    // Check for existing username
    const existingUsername = await db.query.usersTable.findFirst({
        where: eq(usersTable.username, userData.username)
    });

    if (existingUsername) {
        finalUsername = `${userData.username}_${generateRandomString()}`;
    }
    // Check for existing email
    const existingEmail = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, userData.email)
    });

    if (existingEmail) {
        const [localPart, domain] = userData.email.split('@');
        finalEmail = `${localPart}_${generateRandomString()}@${domain}`;
    }

    const newUser = await db.insert(usersTable)
        .values({
            ...userData,
            username: finalUsername,
            email: finalEmail
        })
        .returning();

    return newUser[0];

}


export const getActiveStamps = async (userId: string) => {

    return db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, userId),
        columns: {
            role: false,
            user_id: false,
            nickname: false,
        },
        with: {
            comments: {
                columns: {
                    comment_id: true,
                    updated_at: true,
                }
            },
            progress: {
                columns: {
                    unit_id: true,
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
                    curriculum_id: true,
                    updated_at: true,
                }
            }
        }
    })

}