
import type { Route } from "./+types/subjects-page";
import { getTextbooksBySubjectSlug } from "~/feature/subjects/queries";


export const loader = async ({ params }: Route.LoaderArgs) => {
    const themeSlug = params['theme-slug'];
    console.log(themeSlug)
    console.log(typeof themeSlug)

    const textbooks = await getTextbooksBySubjectSlug(themeSlug);
    console.dir(textbooks,{depth:null});

    return { themeSlug };
};


export default function SubjectsPage({loaderData}: Route.ComponentProps) {


    const { themeSlug } = loaderData;
    console.log(themeSlug);

    return <h1>{themeSlug}</h1>
};