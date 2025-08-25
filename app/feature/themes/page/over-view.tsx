import { getThemesWithSubjects } from "~/feature/themes/quries";
import type { Route } from "./+types/over-view";

export const loader = async () => {

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
                                <div>
                                    {subject.textbooks.map((textbook) => (
                                        <div key={textbook.textbook_id}>
                                            <h1 className={"text-green-500"}>{`............ `}{textbook.title} </h1>
                                            <div>
                                                {textbook.majors.map((major) => (
                                                    <div key={major.major_id}>
                                                        <h1 className={"text-purple-600"}>{`.................. `}{major.title} </h1>
                                                        <div>
                                                            {major.middles.map((middle) => (
                                                                <div key={middle.middle_id}>
                                                                    <h1 className={"text-orange-500"}>{`........................ `}{middle.title} </h1>
                                                                    <div>
                                                                        {middle.units.map((unit) => (
                                                                            <div key={unit.unit_id}>
                                                                                <h1 >{`.............................. `}{unit.title} </h1>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
