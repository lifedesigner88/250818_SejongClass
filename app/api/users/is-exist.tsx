import type { Route } from "./+types/is-exist";
import { isNickNameExists, isUsernameExists } from "~/api/users/mutation";


export const action = async ({ request }: Route.ActionArgs) => {

    const { username, nickname } = await request.json()
    if (username)
        return await isUsernameExists(username)
    if (nickname)
        return await isNickNameExists(nickname)
}