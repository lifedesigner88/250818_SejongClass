import type { Route } from "./+types/textbook-page"

export async function loader({ params }: Route.LoaderArgs) {
    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    if (!themeSlug || !subjectSlug || !textbookId) {
        throw new Error("Missing required parameters");
    }

    return { themeSlug, subjectSlug, textbookId };
}

export default function TextbookPage({ loaderData }: Route.ComponentProps) {
    const { themeSlug, subjectSlug, textbookId } = loaderData;

    return (
        <div className="p-4">
            <h1>Textbook Page</h1>
            <div>Theme Slug: {themeSlug}</div>
            <div>Subject Slug: {subjectSlug}</div>
            <div>Textbook ID: {textbookId}</div>
        </div>
    );
}