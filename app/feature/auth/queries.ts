import { makeSSRClient } from "~/supa-clents";
import { redirect } from "react-router";

export const getUserIdFromSession = async (request: Request) => {
    const { client } = makeSSRClient(request);
    const { data: { user }, error } = await client.auth.getUser();

    if (error || !user) {
        throw redirect("/themes");
    }

    return { userId: user.id };
};