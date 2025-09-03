import { makeSSRClient } from "~/supa-clents";

export const getUserIdFromSession = async (request: Request) => {
    const { client } = makeSSRClient(request);
    const { data: { user }, error } = await client.auth.getUser();

    if (error || !user) throw null;

    return user.id
};
