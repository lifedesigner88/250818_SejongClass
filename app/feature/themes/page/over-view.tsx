import { getThemes } from "~/feature/subjects/helper";
import { getThemesWithSubjects } from "~/feature/themes/quries";
import type { Route } from "./+types/over-view";

export const loader = async () => {

    const themes = await getThemes();
    console.log("themes", themes)

    const themeWithSubjects = await getThemesWithSubjects();
    console.dir(themeWithSubjects, {
        depth: null,
    })

    return { themeWithSubjects }
}


export default function OverViewPage({ loaderData }: Route.ComponentProps) {
    const { themeWithSubjects: themes } = loaderData;
    console.log("themes", themes)
    return (
        <div>
            {themes.map((theme) => (
                <div key={theme.themes_id}>
                    <h1 className={"text-red-500"}> {theme.name} </h1>
                    <div>
                        {theme.subjects.map((subject) => (
                            <div key={subject.subject_id}>
                                <h1 className={"text-blue-900"}>{`...... `}{subject.name} </h1>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}