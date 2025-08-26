
import type { Route } from "./+types/subjects-page";


export const loader = async ({ params }: Route.LoaderArgs) => {
    const themeSlug = params['theme-slug'];


    return { themeSlug };
};


export default function SubjectsPage({loaderData}: Route.ComponentProps) {


    const { themeSlug } = loaderData;
    console.log(themeSlug);

    return <h1>{themeSlug}</h1>
};