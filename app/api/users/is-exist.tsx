import type { Route } from "./+types/is-exist";
import { isNickNameExists, isUsernameExists } from "~/api/users/mutation";
import { advancedUsernameRegex } from "~/feature/users/pages/username-input";


export const action = async ({ request }: Route.ActionArgs) => {
    const { username, nickname } = await request.json()
    if (username){
        if (username.length < 3 || username.length > 20) return
        if (!advancedUsernameRegex.test(username)) return
        return await isUsernameExists(username)
    }
    if (nickname){
        if (nickname.length < 3 || nickname.length > 20) return
        return await isNickNameExists(nickname)
    }
}