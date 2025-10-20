import { and, eq, gte, lte } from "drizzle-orm";
import db from "~/db";
import { usersTable } from "~/feature/users/schema";
import { makeSSRClient } from "~/supa-clents";
import { visitlogsTable } from "~/feature/visitlogs/schema";

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


export const deleteProfile = async (request: Request, user_id: string, filePath?: string) => {
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
    let filePaths = data.map((file) => `${folder}${file.name}`)

    if (filePath) // 아바타 업로드시 기존파일 제외하고 삭제
        filePaths = filePaths.filter(item => item !== filePath)

    // 3. 파일 삭제
    await supabase.storage.from('avatars').remove(filePaths)
}


export const stampVisitLog = async (user_id: string) => {
    return db.insert(visitlogsTable).values({ user_id: user_id })
}


export const getUserVisitLog = async (userId : string) => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return db.query.visitlogsTable.findFirst({
        where: and(
            eq(visitlogsTable.user_id, userId),
            gte(visitlogsTable.updated_at, startOfDay),
            lte(visitlogsTable.updated_at, endOfDay)
        ),
    })

}
