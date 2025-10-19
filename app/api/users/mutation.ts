import { and, eq } from "drizzle-orm";
import db from "~/db";
import { usersTable } from "~/feature/users/schema";
import { makeSSRClient } from "~/supa-clents";

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

export const deleteUserInfo = async (user_id: string) => {
    return db.delete(usersTable).where(eq(usersTable.user_id, user_id))
}


export const deleteProfile = async (request: Request, user_id: string) => {
    const { client: supabase } = makeSSRClient(request)
    const folder = `${user_id}/`

    // 1. 해당 prefix로 시작하는 모든 파일 목록 가져오기
    const { data, error: listError } = await supabase
        .storage
        .from('avatars')          // 버킷 이름
        .list(folder)

    if (listError) {
        console.error('파일 목록 가져오기 실패:', listError.message)
        return
    }
    // 2. 파일 경로 배열 생성
    const filePaths = data.map((file) => `${folder}${file.name}`)
    // 3. 파일 삭제
    await supabase.storage.from('avatars').remove(filePaths)

}

