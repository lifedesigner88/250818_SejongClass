import type { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";


type TextbookInfo = Awaited<ReturnType<typeof getTextbookInfobyTextBookId>>;

export const calculateTotalProgressOptimized = (textbookInfo: TextbookInfo): number => {
    if (!textbookInfo?.majors?.length) return 0;

    let totalUnits = 0;
    let checkedUnits = 0;
    let totalCurriculums = 0;
    let checkedCurriculums = 0;

    // 더 적극적인 early return
    for (const major of textbookInfo.majors) {
        if (!major.middles?.length) continue;

        for (const middle of major.middles) {
            if (!middle.units?.length) continue;

            for (const unit of middle.units) {
                totalUnits++;

                if (unit.progress?.length > 0) {
                    checkedUnits++;
                }

                if (unit.curriculums?.length > 0) {
                    for (const curriculum of unit.curriculums) {
                        totalCurriculums++;

                        if (curriculum.checklists?.length > 0) {
                            checkedCurriculums++;
                        }
                    }
                }
            }
        }
    }

    if (totalUnits === 0) return 0;

    const unitProgress = (checkedUnits / totalUnits) * 100;
    const curriculumProgress = totalCurriculums > 0 ? (checkedCurriculums / totalCurriculums) * 100 : 0;
    const totalProgress = (unitProgress * 0.5) + (curriculumProgress * 0.5);

    return Math.round(totalProgress * 100) / 100;
};