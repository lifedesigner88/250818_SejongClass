import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/textbook-layout";
import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { z } from "zod";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    const paramsSchema = z.object({ textbookId: z.coerce.number().min(1) });
    const { success, data } = paramsSchema.safeParse({ textbookId });
    if (!success) throw redirect("/404");

    const textbookInfo = await getTextbookInfobyTextBookId(data.textbookId);

    console.dir(textbookInfo, { depth: null });
    // 정확한 경로인지 체크
    if (!( textbookInfo
        && textbookInfo.subject.slug === subjectSlug
        && textbookInfo.subject.theme.slug === themeSlug)
    ) throw redirect("/404");


    return { themeSlug, subjectSlug, textbookInfo };
}

export default function TextbookLayout({ loaderData }: Route.ComponentProps) {
    const { themeSlug, subjectSlug, textbookInfo } = loaderData;
    return (
        <div className="flex min-h-screen flex-col">
            {
                `${themeSlug} / ${subjectSlug} / ${textbookInfo?.title}`
            }
            <Outlet/>
        </div>
    );
}