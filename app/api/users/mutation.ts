import { and, eq } from "drizzle-orm";
import db from "~/db";
import { usersTable } from "~/feature/users/schema";

export const updateUserProfile = (
    user_id: string,
    beforeUsername: string,
    username: string,
    nickname: string,
    profile_url: string,
) => {

    return db.update(usersTable).set({
        username,
        nickname,
        profile_url,
    })
        .where(
            and(
                eq(usersTable.username, beforeUsername),
                eq(usersTable.user_id, user_id),
            )
        )
}

export const isUsernameExists = async (username: string) => {
    const usernameExist = await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username)
    })
    return !!usernameExist
}

export const isNickNameExists = async (nickname: string) => {
    const existingNickname = await db.query.usersTable.findFirst({
        where: eq(usersTable.nickname, nickname)
    })
    return !!existingNickname
}