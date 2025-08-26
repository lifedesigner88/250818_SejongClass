import {
    getThemesWithSubjectsANDTextbooksANDMajorsANDMiddlesANDUnitsANDDealings
} from "~/feature/themes/quries";
import type { Route } from "./+types/all-contents";


export const loader = async () => {

    const themeWithSubjects = await getThemesWithSubjectsANDTextbooksANDMajorsANDMiddlesANDUnitsANDDealings();
    return { themeWithSubjects }
}

export default function AllContents({ loaderData }: Route.ComponentProps) {
    const { themeWithSubjects: themes } = loaderData;
    return (
        <div className={"m-20 flex gap-40"}>
            {themes.map((theme) => (
                <div key={theme.themes_id}>
                    <h1 className={"text-red-500"}> {theme.name} - theme </h1>
                    <div>
                        {theme.subjects.map((subject) => (
                            <div key={subject.subject_id}>
                                <h1 className={"text-blue-900"}>{`...... `}{subject.name} - subject</h1>
                                <div>
                                    {subject.textbooks.map((textbook) => (
                                        <div key={textbook.textbook_id}>
                                            <h1 className={"text-green-500"}>{`............ `}{textbook.title} -
                                                                                                               textbook</h1>
                                            <div>
                                                {textbook.majors.map((major) => (
                                                    <div key={major.major_id}>
                                                        <h1 className={"text-purple-600"}>{`.................. `}{major.title} -
                                                                                                                               major</h1>
                                                        <div>
                                                            {major.middles.map((middle) => (
                                                                <div key={middle.middle_id}>
                                                                    <h1 className={"text-orange-500"}>{`........................ `}{middle.title} -
                                                                                                                                                  middle </h1>
                                                                    <div>
                                                                        {middle.units.map((unit) => (
                                                                            <div key={unit.unit_id}>
                                                                                <h1 className={"text-pink-500"}>{`.............................. `}{unit.title} -
                                                                                                                                                                unit</h1>
                                                                                <div>
                                                                                    {unit.dealings.map((unitConcept) => (
                                                                                        <div
                                                                                            key={unitConcept.concept.concept_id}>
                                                                                            <h1 className={"text-cyan-500"}>{`................................... `}({unitConcept.concept.concept_id}) {unitConcept.concept.name} -
                                                                                                                                                                    concept</h1>
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
                </div>
            ))}
        </div>
    );
}
